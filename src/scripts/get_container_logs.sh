#!/bin/bash

CONTAINER_ID=$1

# Fetch logs using docker logs command
LOGS=$(docker logs "$CONTAINER_ID" 2>&1)

# Construct JSON output
echo '{ "logs": ['

# Split logs into lines and format each line as a JSON object
IFS=$'\n'
first=true
for LOG in $LOGS; do
  if [ "$first" = true ]; then
    first=false
  else
    echo ','
  fi
  TIMESTAMP=$(date +"%Y-%m-%dT%H:%M:%SZ")
  echo "  { \"timestamp\": \"$TIMESTAMP\", \"level\": \"info\", \"message\": \"${LOG//\"/\\\"}\" }"
done

# End JSON array
echo '] }'
