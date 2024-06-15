#!/bin/bash

IMAGE_ID=$1

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker to use this script."
    exit 1
fi

# Get Docker image by ID
docker inspect $IMAGE_ID
