// Controller: executeInDocker.js

// Language-specific executors
const { executeCpp } = require('./executeCpp');
const executeJava = require('./executeJava').executeJava;
const { executePython } = require('./executePython');

const executeInDocker = (language, code, input = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      let result;
      if (language === 'cpp') {
        result = await executeCpp(code, input);
      } else if (language === 'java') {
        result = await executeJava(code, input);
      } else if (language === 'python') {
        result = await executePython(code, input);
      } else {
        return reject({ message: 'Unsupported language' });
      }
      resolve(result);
    } catch (err) {
      // If err already has type/message, pass as is
      if (err && err.type && err.message) {
        return reject(err);
      }
      // Otherwise, wrap as runtime error
      reject({
        type: 'runtime',
        message: 'Execution failed',
        details: err.details || err.message || err
      });
    }
  });
};

module.exports = { executeInDocker };
