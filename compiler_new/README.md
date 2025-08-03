# Compiler Service v2 - CodeHert (Docker-based)

This directory contains the **new Docker-based code execution service** for CodeHert, responsible for running user-submitted code in various languages with enhanced security and isolation.

## 🆕 What's New in v2
- **Docker Containerization**: Each language runs in its own isolated Docker container
- **Enhanced Security**: Complete isolation between code executions
- **Concurrency Control**: Prevents system overload with execution limits
- **Better Error Handling**: Sophisticated error classification and reporting
- **Improved Architecture**: Modular design with separate services and utilities

## Overview
- **Node.js Service**: Runs as a standalone Node.js application that manages Docker containers
- **Dynamic Container Creation**: Creates temporary Docker containers for each code execution
- **Multi-language Support**: Supports C++, Python, and Java with language-specific containers
- **Container Lifecycle**: Automatically creates, executes, and destroys containers
- **HTTP API**: Receives code execution requests and returns results
- **Resource Management**: Implements concurrency control and resource limits

## Architecture

### Execution Flow
1. **HTTP Request**: Client sends code execution request to Node.js service
2. **Container Creation**: Service dynamically creates a Docker container for the specific language
3. **Code Execution**: Code runs inside the isolated container with resource limits
4. **Result Collection**: Output/errors are captured from the container
5. **Container Cleanup**: Container is automatically destroyed after execution
6. **Response**: Results are sent back to the client

### Key Components
- **index.js**: Main Express server that receives HTTP requests
- **executeInDocker.js**: Core controller that manages container lifecycle
- **execute{Language}.js**: Language-specific execution logic (C++, Java, Python)
- **config/languageConfig.js**: Language-specific configurations and limits
- **services/dockerService.js**: Docker container management utilities
- **services/errorClassifier.js**: Advanced error classification and formatting
- **utils/fileUtils.js**: File management and cleanup utilities
- **Dockerfile.{cpp,java,python}**: Container templates for each language

## Setup

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- At least 2GB RAM available for containers

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file:
```bash
PORT=8000
NODE_ENV=production
MAX_CONCURRENT_EXECUTIONS=1
```

### 3. Build Docker Images
```bash
# Build all language-specific images
docker build -f Dockerfile.cpp -t codehert-cpp .
docker build -f Dockerfile.java -t codehert-java .
docker build -f Dockerfile.python -t codehert-python .
```

### 4. Run the Service

#### Development Mode
```bash
node index.js
```
- The Node.js service will start on port 8000
- It will dynamically create Docker containers for each code execution
- Containers are created, executed, and destroyed automatically

#### Production Mode
```bash
# Start the Node.js service
npm start
```

#### Using PM2 (Recommended for Production)
```bash
npm install -g pm2
pm2 start index.js --name "codehert-compiler"
pm2 save
pm2 startup
```

## API

### POST `/run`
- **Description:** Execute code in a specified language with optional input in isolated Docker containers.
- **Request Body:**
  ```json
  {
    "language": "cpp" | "python" | "java",
    "code": "...source code...",
    "input": "...input..." // optional
  }
  ```
- **Response (Success):**
  ```json
  {
    "output": "program output",
    "errorOutput": "stderr if any"
  }
  ```
- **Response (Error):**
  ```json
  {
    "type": "compilation" | "runtime" | "tle" | "mle" | "ole",
    "message": "Error description",
    "details": "Detailed error information"
  }
  ```

### GET `/health`
- **Description:** Health check endpoint for monitoring and CI/CD
- **Response:**
  ```json
  {
    "status": "healthy",
    "timestamp": "2025-08-03T10:30:00.000Z",
    "service": "compiler-service",
    "version": "1.0.0"
  }
  ```

## Error Types
- **compilation**: Code compilation failed
- **runtime**: Runtime error during execution
- **tle**: Time Limit Exceeded (>5 seconds)
- **mle**: Memory Limit Exceeded (>256MB)
- **ole**: Output Limit Exceeded (>1MB)

## Security Features
- **Container Isolation**: Each execution runs in a separate Docker container
- **Resource Limits**: Memory, CPU, and time constraints
- **Network Isolation**: Containers have no network access
- **File System Isolation**: Temporary files are contained and cleaned up
- **Concurrency Control**: Limited concurrent executions prevent DoS

## Environment Variables
- `PORT`: Service port (default: 8000)
- `NODE_ENV`: Environment mode (development/production)
- `MAX_CONCURRENT_EXECUTIONS`: Maximum parallel executions (default: 1)

## Development

### Directory Structure
```
compiler_new/
├── config/           # Language configurations
├── services/         # Core services (Docker, error handling)
├── utils/           # Utility functions
├── codes/           # Temporary code files
├── Dockerfile.*     # Language-specific containers
├── executeInDocker.js   # Main execution controller
├── execute*.js      # Language-specific executors
└── index.js         # Express server
```

### Adding New Languages
1. Create `Dockerfile.{language}` with required runtime
2. Add language configuration in `config/languageConfig.js`
3. Implement executor in `execute{Language}.js`
4. Update `executeInDocker.js` to handle the new language

## Monitoring & Logging
- Health check endpoint at `/health`
- Execution metrics logged for monitoring
- Container lifecycle management
- Resource usage tracking

## Migration from v1
The new Docker-based system provides:
- **Better Security**: Complete process isolation
- **Improved Reliability**: Container crashes don't affect the main service
- **Enhanced Scalability**: Better resource management
- **Cleaner Architecture**: Modular, maintainable codebase

## Notes
- **Node.js Runtime**: The service runs as a Node.js application, not inside Docker
- **Docker Dependency**: Requires Docker daemon running on the host system
- **Container Management**: Service has permissions to create/destroy Docker containers
- **Temporary Containers**: Each execution creates a new container that's destroyed afterward
- **Host Integration**: Designed to be called by the backend API, not directly by users
- **Production Deployment**: Consider using PM2, systemd, or container orchestration
- **Resource Monitoring**: Monitor Docker container usage and cleanup
- For more details on the full project, see the main [README](../README.md) 