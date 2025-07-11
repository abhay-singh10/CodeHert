const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filepath, input = '') => {
    const jobId = path.basename(filepath).split(".")[0];
    const className = path.basename(filepath, ".java");
    const outDir = outputPath;

    return new Promise((resolve, reject) => {
        // Use environment variables for Java paths, fallback to 'javac' and 'java'
        const javacPath = process.env.JAVAC_PATH || 'javac';
        const javaPath = process.env.JAVA_PATH || 'java';
        
        // Compile first
        exec(`${javacPath} ${filepath} -d ${outDir}`, (compileError, _, compileStderr) => {
            if (compileError) {
                return reject({
                    type: 'compilation',
                    message: 'Compilation failed',
                    details: compileStderr || compileError.message
                });
            }

            // Run the class file with spawn
            const run = spawn(javaPath, ['-cp', outDir, className], { cwd: outDir });
            let stdout = '';
            let stderr = '';

            if (input) {
                run.stdin.write(input);
            }
            run.stdin.end();

            run.stdout.on('data', (data) => { stdout += data; });
            run.stderr.on('data', (data) => { stderr += data; });

            run.on('error', (err) => {
                reject({
                    type: 'runtime',
                    message: 'Failed to start process',
                    details: err.message
                });
            });

            run.on('close', (code) => {
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
    executeJava,
}; 