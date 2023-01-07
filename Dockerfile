FROM ubuntu:18.10
WORKDIR /opt/app
ADD package.json package.json
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN apk add --update --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing --repository http://dl-3.alpinelinux.org/alpine/edge/main vips-dev
RUN pip3 install --no-cache --upgrade pip setuptools
RUN sudo apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN sudo apt-get install nodejs
RUN npm install --legacy-peer-deps
ADD . .
RUN npm run build
RUN npm prune --production
CMD ("node", "./dist/main.js")