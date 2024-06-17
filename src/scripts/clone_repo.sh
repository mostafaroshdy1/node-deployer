#!/bin/bash

# Function to generate a random directory name
generate_random_directory() {
  date +%s | sha256sum | base64 | head -c 32
}

# Check if repository URL argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <repository_url>"
  exit 1
fi

REPO_URL=$1

# Generate a random directory name
RANDOM_DIR=$(generate_random_directory)

# Clone the repository into the random directory
git clone "$REPO_URL" "../repos/$RANDOM_DIR" >/dev/null 2>&1

# Print the random directory name
echo "$RANDOM_DIR"
