const express = require('express');
const { executeInDocker } = require('./executeInDocker');
require('dotenv').config();

(async () => {
  const pLimit = (await import('p-limit')).default;
  const limit = pLimit(1); // Only 1 concurrent execution allowed

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
      const { language = 'cpp', code, input = '' } = req.body;
      if (!code) {
          return res.status(400).json({ success: false, error: "Empty code!" });
      }
      try {
          const result = await limit(() => executeInDocker(language, code, input));
          res.json({ output: result.stdout, errorOutput: result.stderr });
      } catch (error) {
          res.status(400).json(error);
      }
  });

  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}!`);
  });
})();