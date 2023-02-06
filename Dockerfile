FROM node:14-alpine3.17
WORKDIR /opt/app
ADD package.json package.json
RUN sudo npm install --global yarn
RUN yarn install
ADD . .
RUN npm run build
CMD ("node", "./dist/main.js")