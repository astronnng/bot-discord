FROM node:18-alpine

# Install curl for reliable healthchecks if needed, although not strictly necessary for the bot itself
# RUN apk add --no-cache curl

WORKDIR /usr/src/app

# Copy package definition and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and other files
# Note: We rely on .dockerignore to exclude node_modules, .env, etc.
COPY . .

# Start the bot
# Use wait-on logic or simple retry loop in CMD
CMD [ "sh", "-c", "echo 'Sleeping 15s to wait for Lavalink...' && sleep 15 && npm start" ]