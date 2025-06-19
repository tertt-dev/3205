FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN yarn global add serve
RUN yarn install

COPY . .

RUN CI=true node node_modules/react-scripts/scripts/build.js

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"] 