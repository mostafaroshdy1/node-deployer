#!/bin/bash

# Check if an image ID is provided
if [ -z "$1" ]; then
  exit 1
fi

IMAGE_ID=$1

# Find and stop all running containers based on the image
CONTAINER_IDS=$(docker ps -a -q --filter "ancestor=$IMAGE_ID")

if [ -n "$CONTAINER_IDS" ]; then
  # Stop the containers, suppressing output
  docker stop $CONTAINER_IDS > /dev/null 2>&1
  
  # Remove the containers along with their associated volumes, suppressing output
  docker rm -v $CONTAINER_IDS > /dev/null 2>&1
fi

# Remove the image, suppressing output
docker rmi $IMAGE_ID --force > /dev/null 2>&1

# Check if the image was successfully removed
if [ $? -eq 0 ]; then
  echo "$IMAGE_ID"
else
  exit 1
fi
