FROM node:18-slim

# Create app directory
WORKDIR /usr/app

# Set up environment
RUN apt update && \
    apt install -y python3 ffmpeg make build-essential libopus-dev

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .

# Start the bot
CMD [ "yarn", "run", "local:run" ]