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
echo "$DEST_PATH/$RANDOM_DIR"
git clone --progress "$REPO_URL" "$DEST_PATH/$RANDOM_DIR" 2>&1 | tee clone_output.log

# Check the exit status of git clone
GIT_CLONE_STATUS=$?
if [ $GIT_CLONE_STATUS -ne 0 ]; then
  echo "Error: Failed to clone repository."
  cat clone_output.log  # Print the log file to see details of the error
  exit $GIT_CLONE_STATUS
fi

# Print the random directory name
echo "Repository successfully cloned into directory: $DEST_PATH/$RANDOM_DIR"
echo "$RANDOM_DIR"
