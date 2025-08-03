FROM alpine:latest

RUN apk add --no-cache g++

WORKDIR /app