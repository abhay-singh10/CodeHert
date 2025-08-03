// utils/fileUtils.js
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');


// Use absolute host path for codes directory
const codesDir = path.resolve(__dirname, '..', 'codes');
if (!fs.existsSync(codesDir)) {
  fs.mkdirSync(codesDir, { recursive: true });
}

function createTempFolder() {
  const jobId = uuid();
  // Use cross-platform absolute path for host path
  const hostBasePath = path.resolve(__dirname, '..', 'codes');
  const hostFolderPath = path.join(hostBasePath, jobId);
  const containerFolderPath = `/app/codes/${jobId}`;
  // Create directory using host path
  fs.mkdirSync(hostFolderPath, { recursive: true });
  return { hostFolderPath, containerFolderPath, jobId };
}

function writeCodeFile(folderPath, filename, code) {
  const filePath = path.join(folderPath, filename);
  try {
    fs.writeFileSync(filePath, code);
  } catch (e) {
    // Optionally handle error silently or rethrow
  }
  return filePath;
}

function writeInputFile(folderPath, input) {
  const filePath = path.join(folderPath, 'input.txt');
  try {
    fs.writeFileSync(filePath, input);
  } catch (e) {
    // Optionally handle error silently or rethrow
  }
  return filePath;
}

function cleanupFolder(folderPath) {
  try {
    fs.rmSync(folderPath, { recursive: true, force: true });
  } catch (e) {
    // Optionally handle error silently or rethrow
  }
}

module.exports = { createTempFolder, writeCodeFile, writeInputFile, cleanupFolder };