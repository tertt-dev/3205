FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install

COPY . .

RUN yarn prisma generate
RUN yarn build

EXPOSE 4000

CMD yarn prisma migrate deploy && yarn start 