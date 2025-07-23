const express = require('express');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { executeJava } = require('./executeJava');
const { executePython } = require('./executePython');

const app = express();

//middlewares
app.use(express.json({ limit: '10mb' }));

// Health check endpoint for CI/CD - Updated for pipeline test
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'compiler-service',
        version: '1.0.0'
    });
});

app.post("/run", async (req, res) => {
    const { language = 'cpp', code , input = '' } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = generateFile(language, code);
        let result;
        if (language === 'java') {
            result = await executeJava(filePath, input);
        } else if (language === 'python') {
            result = await executePython(filePath, input);
        } else {
            result = await executeCpp(filePath, input);
        }
        res.json({ output: result.stdout, errorOutput: result.stderr });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                type: error.type || 'runtime',
                message: error.message,
                details: error.details || error.stack
            });
        } else {
            res.status(500).json(error);
        }
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
});