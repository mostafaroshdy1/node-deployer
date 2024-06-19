#!/bin/bash

# Check if argument is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <path_to_dockerfile_dir>"
    exit 1
fi

# Assign the directory path from the argument
dockerfile_dir="$1"

# Check if the directory exists
if [ ! -d "$dockerfile_dir" ]; then
    echo "Directory not found: $dockerfile_dir"
    exit 1
fi

# Navigate to the Dockerfile directory
cd "$dockerfile_dir" || exit 1

# Extract the Dockerfile name
dockerfile_name=$(basename "$dockerfile_dir")

# Build Docker image and capture the image ID
image_id=$(docker build -q -t mydockerimage:"$dockerfile_name" .)

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "$image_id"
else
    echo "Failed to build Docker image."
fi
