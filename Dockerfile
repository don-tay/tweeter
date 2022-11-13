# --------------> The build image
FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build
 
# --------------> The production image
FROM node:18-alpine
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node ./views ./views
COPY --chown=node:node ./public ./public
RUN chown -R node:node /usr/src/app
USER node
CMD ["dumb-init", "node", "dist/server.js"]
