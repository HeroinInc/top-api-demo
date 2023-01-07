FROM node:16-ubuntu
WORKDIR /opt/app
ADD package.json package.json
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN npm install -g npm@9.2.0
RUN pip3 install --no-cache --upgrade pip setuptools
RUN npm install --arch=arm64 --platform=linux --libc=musl --legacy-peer-deps
ADD . .
RUN npm run build
RUN npm prune --production
CMD ("node", "./dist/main.js")