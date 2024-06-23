#!/bin/bash

# Get container ID and number of cores assigned as arguments
container_id=$1
num_cores_assigned=$2

# Get current CPU usage for the container (in percentage)
cpu_usage=$(docker stats --no-stream --format "{{.CPUPerc}}" $container_id | tail -n 1 | cut -d'%' -f1)

# Get total CPU cores available on the host
total_cpu_cores=$(grep -c ^processor /proc/cpuinfo)

# Check if the number of cores assigned is less than 1
if (( $(echo "$num_cores_assigned < 1" | bc -l) )); then
    cpu_usage_percentage=$cpu_usage
else
    # Calculate CPU usage based on assigned cores
    cpu_usage_percentage=$(echo "scale=2; $cpu_usage / $num_cores_assigned" | bc)
fi

echo "$cpu_usage_percentage"
