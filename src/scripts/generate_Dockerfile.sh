#!/bin/bash

# Check if the user provided a Node.js version and a path as arguments
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <node-version> <path>"
  exit 1
fi

NODE_VERSION=$1
TARGET_PATH=$2

# Create the directory if it doesn't exist
mkdir -p "$TARGET_PATH"

# Create the Dockerfile in the specified path
cat <<EOF > "$TARGET_PATH/Dockerfile"
FROM node:$NODE_VERSION-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["node", "app.js"]
EOF

echo -n "Dockerfile created at $TARGET_PATH with Node.js version $NODE_VERSION"

