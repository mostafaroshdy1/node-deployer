#!/bin/bash

# Check if arguments are provided
if [ $# -ne 2 ]; then
    exit 1
fi

# Assign the directory path and image name from the arguments
dockerfile_dir="$1"
image_name="$2"

# Check if the directory exists
if [ ! -d "$dockerfile_dir" ]; then
    exit 1
fi

# Navigate to the Dockerfile directory
cd "$dockerfile_dir" || exit 1

# Generate a unique tag using the current timestamp
timestamp=$(date +%Y%m%d%H%M%S)
tagged_image_name="$image_name:$timestamp"

# Build Docker image and capture the image ID, suppressing warnings
image_id=$(docker build -q -t "$tagged_image_name" . 2>/dev/null)

# Check if build was successful and print image_id if it is
if [ $? -eq 0 ]; then
    echo -n $image_id
else
    exit 1
fi
