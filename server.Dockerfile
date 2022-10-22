FROM node:latest

COPY . .

RUN npm i -g npm pnpm

RUN pnpm i --ignore-scripts

EXPOSE 3000

ARG DOCKER=TRUE
ENV DOCKER=$DOCKER

CMD ["pnpm", "watch:serve"]
