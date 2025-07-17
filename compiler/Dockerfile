# Use the Node.js Alpine image as the base image
FROM node:18-alpine

# Set the working directory inside the container app is the name
WORKDIR /app

# Install GCC and other necessary build tools
RUN apk update && apk add --no-cache g++ openjdk17 python3

# Copy only the package.json and package-lock.json files first, then install dependencies.
# This allows Docker to cache the npm install layer unless dependencies change, speeding up builds.
COPY package*.json ./
RUN npm install

# Copy the application code.
# This layer will only be rebuilt if application code changes.
COPY . .

# Inform Docker and orchestration tools that the app listens on port 8000
EXPOSE 8000

# Specify the command to run when the container starts
CMD [ "node", "index.js" ]