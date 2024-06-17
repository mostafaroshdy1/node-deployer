#!/bin/bash

# Check if exactly 5 arguments are provided
if [ "$#" -ne 5 ]; then

  exit 1
fi

PUBLISHED_PORT=$1
PUBLISHED_IP=$2
MEMORY_MAX_LIMIT=$3
CPU_MAX_LIMIT=$4
IMAGE_ID=$5

# Define the internal container port, assuming it should be the same as the published port.
CONTAINER_PORT=$PUBLISHED_PORT

# Create the Docker container with the specified parameters and capture the container ID
CONTAINER_ID=$(docker run -d -p ${PUBLISHED_IP}:${PUBLISHED_PORT}:${CONTAINER_PORT} \
           --memory ${MEMORY_MAX_LIMIT} \
           --cpus ${CPU_MAX_LIMIT} \
           ${IMAGE_ID})

if [ $? -eq 0 ]; then
  # Output only the container ID
  echo $CONTAINER_ID
else
  echo "Failed to create Docker container from image $IMAGE_ID."
  exit 1
fi
