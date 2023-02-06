FROM sitespeedio/node:ubuntu-22.04-nodejs-18.11.1
WORKDIR /opt/app
ADD package.json package.json
RUN npm install --global yarn
RUN yarn install
ADD . .
RUN npm run build
CMD ("node", "./dist/main.js")