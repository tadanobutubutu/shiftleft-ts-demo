FROM node:20-alpine

RUN apk update && apk upgrade

WORKDIR /usr/src/app
COPY  ./ ./
RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]
