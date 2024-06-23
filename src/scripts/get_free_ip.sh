#!/bin/bash

# Function to check if a given IP address and port is free on localhost
is_free() {
    local IP=$1
    local PORT=$2

    # Check if the port is free using netcat
    nc -z $IP $PORT &> /dev/null
    if [ $? -eq 0 ]; then
        # If nc exits with 0, the port is in use
        return 1
    else
        return 0
    fi
}

# Convert an integer to an IP address
int_to_ip() {
    local IP_INT=$1
    local IP=$((IP_INT>>24&255)).$((IP_INT>>16&255)).$((IP_INT>>8&255)).$((IP_INT&255))
    echo -n $IP
}

# Range of ports to check
START_PORT=1
END_PORT=65535

# Range of IPs to check
START_IP=2130706432  # 127.0.0.0
END_IP=2147483647   # 127.255.255.255

# Iterate through the IP and port range
for (( IP_INT=START_IP; IP_INT<=END_IP; IP_INT++ )); do
    IP=$(int_to_ip $IP_INT)
    for PORT in $(seq $START_PORT $END_PORT); do
        if is_free $IP $PORT; then
            echo -n "$IP:$PORT"
            exit 0
        fi
    done
done

exit 1
