const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

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
            const run = spawn(outPath, [], { cwd: outputPath });
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
            });
            run.stderr.on('data', (data) => { stderr += data; });

            

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
                if (tle || signal === 'SIGKILL') {
                    return reject({
                        type: 'tle',
                        message: 'Time Limit Exceeded',
                        details: 'Process exceeded 1 second time limit.'
                    });
                }
                if (code !== 0) {
                    const details = (stderr && stderr.trim()) ? stderr : (stdout && stdout.trim()) ? stdout : `Process exited with code ${code}`;
                    return reject({
                        type: 'runtime',
                        message: 'Runtime error',
                        details
                    });
                }
                resolve(stdout);
            });
        });
    });
};

module.exports = {
    executeCpp,
};