#!/bin/bash

# Check if an image ID is provided
if [ -z "$1" ]; then
  exit 1
fi

IMAGE_ID=$1

# Remove the image
docker rmi $IMAGE_ID > /dev/null 2>&1

# Check if the image was successfully removed
if [ $? -eq 0 ]; then
  echo "$IMAGE_ID"
else
  exit 1
fi
