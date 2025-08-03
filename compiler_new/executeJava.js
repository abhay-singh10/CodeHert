const { buildDockerCmd, runDockerCommand, removeDockerContainer } = require('./services/dockerService');
const { createTempFolder, writeCodeFile, writeInputFile, cleanupFolder } = require('./utils/fileUtils');
const languageConfig = require('./config/languageConfig');

const executeJava = (code, input = '') => {
  return new Promise(async (resolve, reject) => {
    const config = languageConfig['java'];
    const { hostFolderPath, containerFolderPath, jobId } = createTempFolder();
    writeCodeFile(hostFolderPath, config.filename, code);
    writeInputFile(hostFolderPath, input);
    const fs = require('fs');
    const path = require('path');
    // Step 1: Compile only (longer timeout for Java compilation)
    const compileCmd = buildDockerCmd({
      folderPath: hostFolderPath,
      containerFolderPath,
      compileCmd: config.compileCmd,
      runCmd: '',
      dockerImage: config.dockerImage,
      containerName: jobId
    });
    try {
      await runDockerCommand(compileCmd, hostFolderPath, { timeout: 8000, dockerImage: config.dockerImage });
    } catch (err) {
      cleanupFolder(hostFolderPath);
      removeDockerContainer(jobId);
      // Compilation error
      return reject({
        type: 'compilation',
        message: 'Compilation Error',
        details: err.stderr || err.details || err.message || err
      });
    }

    // Step 2: Run only (strict TLE for execution)
    const runCmd = buildDockerCmd({
      folderPath: hostFolderPath,
      containerFolderPath,
      compileCmd: null,
      runCmd: config.runCmd,
      dockerImage: config.dockerImage,
      containerName: jobId
    });
    try {
      const result = await runDockerCommand(runCmd, hostFolderPath, { timeout: 1000, dockerImage: config.dockerImage });
      cleanupFolder(hostFolderPath);
      removeDockerContainer(jobId);
      resolve(result);
    } catch (err) {
      cleanupFolder(hostFolderPath);
      removeDockerContainer(jobId);
      if (err && err.type && err.message) {
        return reject(err);
      }
      reject({
        type: 'runtime',
        message: 'Execution failed',
        details: err.details || err.message || err
      });
    }
  });
};

module.exports = { executeJava };
