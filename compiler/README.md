# Compiler Service - CodeHert

This directory contains the code execution (compiler) service for CodeHert, responsible for running user-submitted code in various languages securely.

## Overview
- Supports C++, Python, and Java code execution
- Receives code, language, and input via HTTP API
- Returns program output or error details
- Designed to run in a Docker container for isolation and security

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally (for development)
```bash
node index.js
```
- The service will listen on `http://localhost:8000` by default.

### 3. Run with Docker (Recommended for Production)
```bash
docker build -t codehert-compiler .
docker run -p 8000:8000 codehert-compiler
```

## API

### POST `/run`
- **Description:** Execute code in a specified language with optional input.
- **Request Body:**
  ```json
  {
    "language": "cpp" | "python" | "java",
    "code": "...source code...",
    "input": "...input..." // optional
  }
  ```
- **Response:**
  - `{ output: "...", error: null }` on success
  - `{ output: null, error: { type, message, details } }` on error

## Environment Variables
- None required by default. You may add variables for port or resource limits as needed.

## Notes
- Make sure Docker is installed and running if you use the Docker setup.
- This service is intended to be called by the backend API, not directly by users.
- For more details on the full project, see the main [README](../README.md). 