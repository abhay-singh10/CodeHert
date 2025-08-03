// config/languageConfig.js
require('dotenv').config();

module.exports = {
  cpp: {
    filename: 'main.cpp',
    compileCmd: 'g++ main.cpp -o main',
    runCmd: 'timeout 1 ./main',
    dockerImage: process.env.CPP_IMAGE || 'compiler-cpp',
  },
  python: {
    filename: 'main.py',
    compileCmd: null,
    runCmd: 'timeout 2 python3 main.py',
    dockerImage: process.env.PYTHON_IMAGE || 'compiler-python',
  },
  java: {
    filename: 'Main.java',
    compileCmd: 'javac Main.java',
    runCmd: 'java Main',
    dockerImage: process.env.JAVA_IMAGE || 'compiler-java',
  },
};