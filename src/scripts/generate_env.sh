#!/bin/bash

# Check if two arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <directory_path> <json_string>"
    exit 1
fi

# Assign arguments to variables
DIR_PATH=$1
JSON_STRING=$2
ENV_FILE="${DIR_PATH}/.env"

# Check if the directory exists
if [ ! -d "$DIR_PATH" ]; then
    echo "Error: Directory $DIR_PATH does not exist."
    exit 1
fi

# Convert JSON string to individual lines of key-value pairs and write to .env file
echo "$JSON_STRING" | jq -r 'to_entries|map("\(.key)=\(.value)")|.[]' > "$ENV_FILE"
