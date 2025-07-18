const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const MAX_OUTPUT_SIZE = 1024 * 1024; // 1MB

const executeCpp = (filepath, input = '') => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);

    return new Promise((resolve, reject) => {
        // Compile first
        exec(`g++ ${filepath} -o ${outPath}`, (compileError, _, compileStderr) => {
            if (compileError) {
                // Cleanup files on compilation error
                try { fs.unlinkSync(filepath); } catch (e) {}
                try { fs.unlinkSync(outPath); } catch (e) {}
                return reject({
                    type: 'compilation',
                    message: 'Compilation failed',
                    details: compileStderr || compileError.message
                });
            }

            // Run the executable with spawn
            const run = spawn('sh', ['-c', `ulimit -v 262144; "${outPath}"`], { cwd: outputPath });
            let stdout = '';
            let stderr = '';
            // Set up a 1 second timeout for TLE
            const TLE_TIMEOUT = 1000; 
            let tle = false;
            const tleTimer = setTimeout(() => {
                tle = true;
                run.kill('SIGKILL');
            }, TLE_TIMEOUT);

            if (input) {
                run.stdin.write(input);
            }
            run.stdin.end();

            run.stdout.on('data', (data) => {
                stdout += data;
                if (stdout.length > MAX_OUTPUT_SIZE) {
                    run.kill('SIGKILL');
                    stdout = stdout.slice(0, MAX_OUTPUT_SIZE);
                    stderr += '\n[Output Limit Exceeded]';
                }
            });
            run.stderr.on('data', (data) => {
                stderr += data;
                if (stderr.length > MAX_OUTPUT_SIZE) {
                    run.kill('SIGKILL');
                    stderr = stderr.slice(0, MAX_OUTPUT_SIZE);
                    stderr += '\n[Output Limit Exceeded]';
                }
            });

            run.on('error', (err) => {
                // Cleanup files on runtime error
                try { fs.unlinkSync(filepath); } catch (e) {}
                try { fs.unlinkSync(outPath); } catch (e) {}
                reject({
                    type: 'runtime',
                    message: 'Failed to start process',
                    details: err.message
                });
            });

            run.on('close', (code, signal) => {
                clearTimeout(tleTimer);
                // Always cleanup after process ends
                try { fs.unlinkSync(filepath); } catch (e) {}
                try { fs.unlinkSync(outPath); } catch (e) {}

                // OLE detection
                if (stderr.includes('[Output Limit Exceeded]') || stdout.includes('[Output Limit Exceeded]')) {
                    return reject({
                        type: 'ole',
                        message: 'Output Limit Exceeded',
                        details: 'Your program produced too much output.'
                    });
                }

                if (tle || signal === 'SIGKILL') {
                    return reject({
                        type: 'tle',
                        message: 'Time Limit Exceeded',
                        details: 'Process exceeded 1 second time limit.'
                    });
                }
                if (code !== 0) {
                    const details = (stderr && stderr.trim()) ? stderr : (stdout && stdout.trim()) ? stdout : `Process exited with code ${code}`;
                    if (
                        details.includes('std::bad_alloc') ||
                        details.includes('OutOfMemoryError') ||
                        details.includes('MemoryError')
                    ) {
                        return reject({
                            type: 'mle',
                            message: 'Memory Limit Exceeded',
                            details
                        });
                    }
                    return reject({
                        type: 'runtime',
                        message: 'Runtime error',
                        details
                    });
                }
                // Always return both stdout and stderr
                resolve({
                    stdout,
                    stderr
                });
            });
        });
    });
};

module.exports = {
    executeCpp,
};