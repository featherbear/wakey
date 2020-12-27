FROM node:12-alpine

# Install the `net-tools` package that provides `arp`
RUN apk add --update-cache net-tools && rm -rf /var/cache/apk/*

WORKDIR /tmp/build

# Install node modules
COPY yarn.lock package.json ./
RUN yarn

COPY . .

# Build the app and place it in /app
RUN yarn build && mkdir -p /app && mv node_modules __sapper__ package.json data static /app && rm -rf /tmp/build

WORKDIR /app
EXPOSE 3000
CMD [ "node", "__sapper__/build" ]
