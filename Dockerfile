FROM node:14-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN apt-get update
RUN apt-get install python
RUN npm install
ADD . .
RUN npm run build
RUN npm prune --production
CMD ("node", "./dist/main.js")