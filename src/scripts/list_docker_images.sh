#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker to use this script."
    exit 1
fi

# List all Docker images
echo "Listing all Docker images:"
docker images
