# Use the Node.js Alpine image as the base image
FROM node:20-alpine

# Set environment variables
ENV PORT=8000

# Set the working directory inside the container app is the name
WORKDIR /app

# Install GCC and other necessary build tools
RUN apk update && apk add --no-cache g++ openjdk17 python3 \
    && rm -rf /usr/share/man /usr/share/doc /usr/share/info /var/cache/apk/*

# Copy only the package.json first, then install dependencies.
# This allows Docker to cache the npm install layer unless dependencies change, speeding up builds.
COPY package*.json ./
RUN npm install && npm cache clean --force

# Copy the application code.
# This layer will only be rebuilt if application code changes.
COPY . .

# Inform Docker and orchestration tools that the app listens on port 8000
EXPOSE 8000

# Specify the command to run when the container starts
CMD [ "node", "index.js" ]