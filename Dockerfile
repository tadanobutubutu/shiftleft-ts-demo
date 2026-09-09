FROM node:20-alpine

RUN apk update && apk upgrade

WORKDIR /usr/src/app
# WORKDIR creates the directory as root, so it is handed to node before dropping privileges or npm cannot write node_modules into it.
RUN chown node:node /usr/src/app
USER node

# --legacy-peer-deps is passed here rather than read from .npmrc, which the build context excludes, and it is what lets the TypeScript 4 tree install alongside tslint 5.
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --ignore-scripts --legacy-peer-deps

COPY --chown=node:node tsconfig.json tslint.json index.ts db-init.ts ./
COPY --chown=node:node src ./src
RUN npm run compile

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s CMD wget -q -O /dev/null http://127.0.0.1:8089/login || exit 1

ENTRYPOINT [ "npm", "run", "start" ]
