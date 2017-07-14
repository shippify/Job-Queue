FROM node:6.9

RUN apt-get update

RUN apt-get install --no-install-recommends -y redis-server

RUN rm -rf /var/lib/apt/lists/*

RUN mkdir /app

WORKDIR /app

ADD package.json /app/package.json

ADD index.js /app/index.js

RUN npm install

EXPOSE 3030 6379

CMD service redis-server start & node index.js
