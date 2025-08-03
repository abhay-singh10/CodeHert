// services/errorClassifier.js
function classifyDockerError({ code, signal, killedForOLE, killedForTLE, stdout, stderr, dockerImage, timeout, outputLimit }) {
    console.log('dockerImage:', dockerImage);
  if (killedForOLE) {
    return {
      type: 'ole',
      message: 'Output Limit Exceeded',
      details: 'Your program produced too much output.'
    };
  }
  if (killedForTLE) {
    return {
      type: 'tle',
      message: 'Time Limit Exceeded',
      details: `Process exceeded ${timeout / 1000} second time limit.`
    };
  }
  if (code !== 0) {
    // Check for memory limit exceeded conditions
    if (!killedForTLE && !killedForOLE && code === 137 && !stderr) {
      return {
        type: 'mle',
        message: 'Memory Limit Exceeded',
        details: `Memory Limit Exceeded (128MB).`
      };
    }
    // Java: OutOfMemoryError in stderr
    if (stderr && stderr.includes('OutOfMemoryError')) {
      return {
        type: 'mle',
        message: 'Memory Limit Exceeded',
        details: 'Java OutOfMemoryError'
      };
    }
    // Java: exit code 1/2/3 with empty stderr
    if ((code === 1 || code === 2 || code === 3) && stderr === '' && dockerImage === 'compiler-java') {
      return {
        type: 'mle',
        message: 'Memory Limit Exceeded',
        details: 'Java OutOfMemoryError'
      };
    }
    // Python: MemoryError in stderr
    if (dockerImage === 'compiler-python' && stderr && stderr.includes('MemoryError')) {
      return {
        type: 'mle',
        message: 'Memory Limit Exceeded',
        details: 'Python MemoryError'
      };
    }
    // C++: std::bad_alloc in stderr
    if (dockerImage === 'compiler-cpp' && stderr && stderr.includes('std::bad_alloc')) {
      return {
        type: 'mle',
        message: 'Memory Limit Exceeded',
        details: 'std::bad_alloc'
      };
    }

    // C++: Segmentation Fault (stderr or exit code 139)
    if (dockerImage === 'compiler-cpp' && (
      (stderr && stderr.toLowerCase().includes('segmentation fault')) ||
      (code === 139 && (!stderr || stderr.trim() === ''))
    )) {
      return {
        type: 'runtime',
        message: 'Segmentation Fault',
        details: 'Your program tried to access invalid memory (Segmentation Fault).'
      };
    }
    // C++: Stack Overflow (stderr)
    if (dockerImage === 'compiler-cpp' && stderr && stderr.toLowerCase().includes('stack overflow')) {
      return {
        type: 'runtime',
        message: 'Stack Overflow',
        details: 'Your program caused a stack overflow.'
      };
    }
    // Python: RecursionError (case-insensitive)
    if (dockerImage === 'compiler-python' && stderr && stderr.toLowerCase().includes('recursionerror')) {
      return {
        type: 'runtime',
        message: 'Stack Overflow',
        details: 'Your program caused a stack overflow (RecursionError).'
      };
    }
    // Java: StackOverflowError (case-insensitive)
    if (dockerImage === 'compiler-java' && stderr && stderr.toLowerCase().includes('stackoverflowerror')) {
      return {
        type: 'runtime',
        message: 'Stack Overflow',
        details: 'Your program caused a stack overflow (StackOverflowError).'
      };
    }
    // Generic runtime error
    return {
      type: 'runtime',
      message: 'Runtime Error',
      details: stderr || `Process exited with code ${code}`
    };
  }
  // Success: no error
  return null;
}

module.exports = { classifyDockerError };
