#!/bin/bash

# Function to generate a random directory name
generate_random_directory() {
  date +%s | sha256sum | base64 | head -c 32
}

# Check if repository URL and path arguments are provided
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <repository_url> <path>"
  exit 1
fi

REPO_URL=$1
DEST_PATH=$2

# Generate a random directory name
RANDOM_DIR=$(generate_random_directory)

# Clone the repository into the random directory under the specified path
git clone "$REPO_URL" "$DEST_PATH/$RANDOM_DIR" 

# Print the random directory name
echo "$RANDOM_DIR"
