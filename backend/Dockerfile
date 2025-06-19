FROM node:18-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY package.json ./
COPY prisma ./prisma/

RUN yarn global add typescript prisma
RUN yarn install

COPY . .

ENV PRISMA_CLIENT_ENGINE_TYPE="binary"
RUN prisma generate
RUN tsc

EXPOSE 4000

CMD prisma migrate deploy && yarn start 