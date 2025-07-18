const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const MAX_OUTPUT_SIZE = 1024 * 1024; // 1MB

const executeJava = (filepath, input = '') => {
    const codeJobDir = path.dirname(filepath); // codes/<uuid>/
    const jobId = path.basename(codeJobDir);   // uuid
    const outputJobDir = path.join(__dirname, 'outputs', jobId); // outputs/<uuid>/

    // Ensure outputJobDir exists
    if (!fs.existsSync(outputJobDir)) {
        fs.mkdirSync(outputJobDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
        // Compile Main.java to outputs/<uuid>/Main.class
        exec(`javac -d "${outputJobDir}" Main.java`, { cwd: codeJobDir }, (compileError, _, compileStderr) => {
            if (compileError) {
                // Custom handling for public class name/file name mismatch
                const classNameMatch = /error: class (\w+) is public, should be declared in a file named (\w+\.java)/.exec(compileStderr);
                if (classNameMatch) {
                    try { fs.rmSync(codeJobDir, { recursive: true, force: true }); } catch (e) {}
                    try { fs.rmSync(outputJobDir, { recursive: true, force: true }); } catch (e) {}
                    return reject({
                        type: 'compilation',
                        message: `Your public class name ('${classNameMatch[1]}') must match the filename ('${classNameMatch[2]}'). Please rename your class to 'Main'.`,
                        details: compileStderr
                    });
                }
                // Generic cleanup and error handling
                try { fs.rmSync(codeJobDir, { recursive: true, force: true }); } catch (e) {}
                try { fs.rmSync(outputJobDir, { recursive: true, force: true }); } catch (e) {}
                return reject({
                    type: 'compilation',
                    message: 'Compilation failed',
                    details: compileStderr || compileError.message
                });
            }

            // Run the compiled Java class from outputs/<uuid>/
            const run = spawn('java', ['-Xmx256m', '-cp', outputJobDir, 'Main']);
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
                stdout += data.toString();
                if (stdout.length > MAX_OUTPUT_SIZE) {
                    run.kill('SIGKILL');
                    stdout = stdout.slice(0, MAX_OUTPUT_SIZE);
                    stderr += '\n[Output Limit Exceeded]';
                }
            });
            run.stderr.on('data', (data) => {
                stderr += data.toString();
                if (stderr.length > MAX_OUTPUT_SIZE) {
                    run.kill('SIGKILL');
                    stderr = stderr.slice(0, MAX_OUTPUT_SIZE);
                    stderr += '\n[Output Limit Exceeded]';
                }
            });

            run.on('error', (err) => {
                try { fs.rmSync(codeJobDir, { recursive: true, force: true }); } catch (e) {}
                try { fs.rmSync(outputJobDir, { recursive: true, force: true }); } catch (e) {}
                reject({
                    type: 'runtime',
                    message: 'Failed to start process',
                    details: err.message
                });
            });

            run.on('close', (code, signal) => {
                clearTimeout(tleTimer);
                try { fs.rmSync(codeJobDir, { recursive: true, force: true }); } catch (e) {}
                try { fs.rmSync(outputJobDir, { recursive: true, force: true }); } catch (e) {}

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
                resolve({
                    stdout,
                    stderr
                });
            });
        });
    });
};

module.exports = {
    executeJava,
};