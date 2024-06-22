#!/bin/bash

# Check if container ID is provided as an argument
if [ $# -ne 1 ]; then
    echo "Usage: $0 <container_id>"
    exit 1
fi

container_id="$1"

# Check if the container ID exists
docker inspect $container_id > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Error: Container '$container_id' does not exist."
    exit 1
fi

# Get total number of CPU cores
num_cores=$(grep -c ^processor /proc/cpuinfo)

# Get CPU usage of the container
cpu_usage=$(docker stats --no-stream --format "{{.CPUPerc}}" $container_id)

# Calculate average CPU usage across all cores
average_cpu_usage=$(echo "$cpu_usage / $num_cores" | bc)

# Print the CPU usage
echo "Average CPU usage of container $container_id across $num_cores cores:"
echo "${average_cpu_usage}%"
