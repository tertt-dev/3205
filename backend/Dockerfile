FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN yarn global add typescript
RUN yarn install
RUN npx prisma generate

COPY . .
RUN tsc

EXPOSE 4000

CMD npx prisma migrate deploy && yarn start 