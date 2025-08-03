const { spawn, exec } = require('child_process');
const { classifyDockerError } = require('./errorClassifier');

function buildDockerCmd({ folderPath, containerFolderPath, compileCmd, runCmd, dockerImage, containerName }) {
  // Universal input redirection: always use < input.txt
  // Build as argument array for spawn
  // Mount host folderPath to containerFolderPath
  const cmd = compileCmd ? `${compileCmd} && ${runCmd} < input.txt` : `${runCmd} < input.txt`;
  return [
    'docker', 'run', '--rm',
    '--name', containerName,
    '--cpus=0.5', '--memory=128m', '--pids-limit=64', '--network=none',
    `-v`, `${folderPath}:${containerFolderPath}:rw`, '-w', containerFolderPath,
    dockerImage,
    'sh', '-c', cmd
  ];
}

function runDockerCommand(cmdArray, folderPath, { timeout = 1000, outputLimit = 1024 * 1024, dockerImage } = {}) {
  return new Promise((resolve, reject) => {
    // Removed debug log for production
    // Spawn in a new process group
    const proc = spawn(cmdArray[0], cmdArray.slice(1), { cwd: folderPath, detached: true });

    let stdout = '';
    let stderr = '';
    let killedForOLE = false;
    let killedForTLE = false;

    // TLE: Kill process after timeout (cross-platform)
    const tleTimer = setTimeout(() => {
      killedForTLE = true;
      try {
        if (process.platform === 'win32') {
          proc.kill('SIGKILL');
        } else {
          process.kill(-proc.pid, 'SIGKILL');
        }
      } catch (e) {
        // Ignore if already killed
      }
    }, timeout);

    proc.stdout.on('data', (data) => {
      if (killedForOLE || killedForTLE) return;
      stdout += data.toString();
      if (stdout.length > outputLimit) {
        killedForOLE = true;
        proc.kill('SIGKILL');
      }
    });

    proc.stderr.on('data', (data) => {
      if (killedForOLE || killedForTLE) return;
      stderr += data.toString();
      if (stderr.length > outputLimit) {
        killedForOLE = true;
        proc.kill('SIGKILL');
      }
    });

    proc.on('error', (err) => {
      clearTimeout(tleTimer);
      reject({
        type: 'runtime',
        message: 'Execution failed',
        details: err.message,
      });
    });

    proc.on('close', (code, signal) => {
      clearTimeout(tleTimer);
      // Use classifyDockerError for all error classification
      const error = classifyDockerError({
        code,
        signal,
        killedForOLE,
        killedForTLE,
        stdout,
        stderr,
        dockerImage,
        timeout,
        outputLimit
      });
      if (error) {
        return reject(error);
      }
      // Success
      resolve({ stdout, stderr });
    });
  });
}

function removeDockerContainer(containerName) {
  exec(`docker rm -f ${containerName}`, () => { });
}

module.exports = { buildDockerCmd, runDockerCommand, removeDockerContainer };