const { buildDockerCmd, runDockerCommand, removeDockerContainer } = require('./services/dockerService');
const { createTempFolder, writeCodeFile, writeInputFile, cleanupFolder } = require('./utils/fileUtils');
const languageConfig = require('./config/languageConfig');

const executePython = (code, input = '') => {
  return new Promise(async (resolve, reject) => {
    const config = languageConfig['python'];
    const { hostFolderPath, containerFolderPath, jobId } = createTempFolder();
    writeCodeFile(hostFolderPath, config.filename, code);
    writeInputFile(hostFolderPath, input);
    const fs = require('fs');
    const path = require('path');
    await new Promise(resolve => setTimeout(resolve, 100));
    const dockerCmd = buildDockerCmd({
      folderPath: hostFolderPath,
      containerFolderPath,
      compileCmd: config.compileCmd,
      runCmd: config.runCmd,
      dockerImage: config.dockerImage,
      containerName: jobId
    });
    try {
      const result = await runDockerCommand(dockerCmd, hostFolderPath, {timeout : 10000, dockerImage: config.dockerImage} );
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

module.exports = { executePython };
