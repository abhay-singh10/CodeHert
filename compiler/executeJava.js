const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// Output directory for program outputs
const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filepath, input = '') => {
    return new Promise((resolve, reject) => {
        // Use environment variable for java path, fallback to 'java'
        const javaPath = process.env.JAVA_PATH || 'java';
        const jobId = path.basename(filepath).split(".")[0];
        const outPath = path.join(outputPath, `${jobId}.txt`);

        // Spawn the Java process
        const run = spawn(javaPath, [filepath]);
        let stdout = '';
        let stderr = '';

        // Write input to the Java process if provided
        if (input) {
            run.stdin.write(input);
        }
        run.stdin.end();

        // Collect stdout data
        run.stdout.on("data", (data) => { stdout += data; });
        // Collect stderr data
        run.stderr.on("data", (data) => { stderr += data; });

        // Handle process errors
        run.on("error", (err) => {
            // Cleanup files on runtime error
            try { fs.unlinkSync(filepath); } catch (e) {}
            try { fs.unlinkSync(outPath); } catch (e) {}
            reject({
                type: "runtime",
                message: "Failed to start Java process",
                details: err.message
            });
        });

        // Handle process close event
        run.on("close", (code) => {
            // Always cleanup after process ends
            try { fs.unlinkSync(filepath); } catch (e) {}
            try { fs.unlinkSync(outPath); } catch (e) {}
            if (code !== 0) {
                const details = (stderr && stderr.trim()) ? stderr : (stdout && stdout.trim()) ? stdout : `Process exited with code ${code}`;
                return reject({
                    type: "runtime",
                    message: "Java runtime error",
                    details
                });
            }
            resolve(stdout);
        });
    });
};

module.exports = {
    executeJava,
};