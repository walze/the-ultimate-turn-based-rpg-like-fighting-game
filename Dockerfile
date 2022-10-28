#### --- INSTALL --- ####
FROM node:latest AS install

WORKDIR /app

RUN npm i -g npm pnpm

COPY daml.js/ daml.js/
COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

COPY . .

ARG DOCKER=TRUE
ENV DOCKER=$DOCKER

#### --- SERVER --- ####
FROM install as server

WORKDIR /app

EXPOSE 3000

CMD ["pnpm", "start:server"]

#### --- CLIENT --- ####
FROM install AS client

WORKDIR /app

EXPOSE 5173

CMD ["pnpm", "start:client"]
