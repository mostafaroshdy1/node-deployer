#!/bin/bash

# Check if a container ID is provided
if [ -z "$1" ]; then
  exit 1
fi

CONTAINER_ID=$1

# Stop the container if it's running
docker stop $CONTAINER_ID > /dev/null 2>&1

# Remove the container
docker rm -v $CONTAINER_ID > /dev/null 2>&1

# Check if the container was successfully removed
if [ $? -eq 0 ]; then
  echo -n "$CONTAINER_ID"
else
  exit 1
fi
