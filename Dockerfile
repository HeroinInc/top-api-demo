FROM node:14-alpine
WORKDIR /opt/app
ADD package.json package.json
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN npm install
ADD . .
RUN npm run build
RUN npm prune --production
CMD ("node", "./dist/main.js")