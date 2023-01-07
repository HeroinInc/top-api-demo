FROM ubuntu:18.10
WORKDIR /opt/app
ADD package.json package.json
RUN sudo apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN sudo apt-get install nodejs
RUN npm install --legacy-peer-deps
ADD . .
RUN npm run build
RUN npm prune --production
CMD ("node", "./dist/main.js")