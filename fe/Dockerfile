FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 80

CMD [ "serve", "-s", "dist", "-p", "80" ]