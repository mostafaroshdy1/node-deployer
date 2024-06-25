#!/bin/bash

# Function to generate a random directory name
generate_random_directory() {
  date +%s | sha256sum | base64 | head -c 32
}

# Check if repository URL and path arguments are provided
if [ -z "$1" ] || [ -z "$2" ]; then
  exit 1
fi

REPO_URL=$1
DEST_PATH=$2

# Generate a random directory name
RANDOM_DIR=$(generate_random_directory)

# Clone the repository into the random directory under the specified path
git clone "$REPO_URL" "$DEST_PATH/$RANDOM_DIR" &>/dev/null

# Check the exit status of git clone
GIT_CLONE_STATUS=$?
if [ $GIT_CLONE_STATUS -ne 0 ]; then
  exit $GIT_CLONE_STATUS
fi

# Print the random directory name
echo -n "$RANDOM_DIR"
