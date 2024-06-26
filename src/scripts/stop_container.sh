#!/bin/bash

# Check if a container ID is provided
if [ -z "$1" ]; then
  echo "Error: No container ID provided."
  exit 1
fi

CONTAINER_ID=$1

# Stop the container
docker stop $CONTAINER_ID > /dev/null 2>&1

# Check if the container was successfully stopped
if [ $? -eq 0 ]; then
  echo -n "$CONTAINER_ID"
  exit 0
else
  echo "Failed to stop container $CONTAINER_ID."
  exit 1
fi
