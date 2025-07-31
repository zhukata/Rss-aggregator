FROM node:22-slim

ENV PATH="$PATH:node_modules/.bin"

RUN apt-get update && apt-get install -y make

WORKDIR /app

COPY package*.json ./
COPY Makefile ./

RUN make install

COPY . .

CMD [ "make", "start" ]