#!/bin/bash

# Check if container ID is provided as an argument
if [ $# -ne 1 ]; then
    exit 1
fi

container_id="$1"

# Get memory usage of the container in MB
memory_usage=$(docker stats --no-stream --format "{{.MemUsage}}" $container_id | awk '{print $1 $2}')

# Extract numeric value and unit
memory_value=$(echo $memory_usage | grep -oP '^[0-9.]+')
memory_unit=$(echo $memory_usage | grep -oP '[a-zA-Z]+')

# Convert memory usage to MB
case $memory_unit in
    "GiB")
        memory_mb=$(echo "scale=2; $memory_value * 1024" | bc)
        ;;
    "MiB")
        memory_mb=$memory_value
        ;;
    "KiB")
        memory_mb=$(echo "scale=2; $memory_value / 1024" | bc)
        ;;
    *)
        echo "Unknown memory unit: $memory_unit"
        exit 1
        ;;
esac

# Print memory usage in MB
echo $memory_mb
