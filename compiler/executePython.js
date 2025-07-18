const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const MAX_OUTPUT_SIZE = 1024 * 1024; // 1MB

const executePython = (filepath, input = '') => {
    return new Promise((resolve, reject) => {
        // Use environment variable for Python path, fallback to 'python'
        const pythonPath = process.env.PYTHON_PATH || 'python3';
        
        // Run the Python file with spawn
        const run = spawn('sh', ['-c', `ulimit -v 262144; ${pythonPath} "${filepath}"`]);
        let stdout = '';
        let stderr = '';

        if (input) {
            run.stdin.write(input);
        }
        run.stdin.end();

        // Set up a 1 second timeout for TLE
        const TLE_TIMEOUT = 2000; // 2 second in milliseconds because python is slower
        let tle = false;
        const tleTimer = setTimeout(() => {
            tle = true;
            run.kill('SIGKILL');
        }, TLE_TIMEOUT);

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
            // OLE detection
            if (stderr.includes('[Output Limit Exceeded]') || stdout.includes('[Output Limit Exceeded]')) {
                return reject({
                    type: 'ole',
                    message: 'Output Limit Exceeded',
                    details: 'Your program produced too much output.'
                });
            }
            //check for tle
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
};

module.exports = {
    executePython,
}; 