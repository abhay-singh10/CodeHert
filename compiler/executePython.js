const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = (filepath, input = '') => {
    return new Promise((resolve, reject) => {
        // Use environment variable for Python path, fallback to 'python'
        const pythonPath = process.env.PYTHON_PATH || 'python3';
        
        // Run the Python file with spawn
        const run = spawn(pythonPath, [filepath]);
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

        run.stdout.on('data', (data) => { stdout += data; });
        run.stderr.on('data', (data) => { stderr += data; });

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
                return reject({
                    type: 'runtime',
                    message: 'Runtime error',
                    details
                });
            }
            resolve(stdout);
        });
    });
};

module.exports = {
    executePython,
}; 