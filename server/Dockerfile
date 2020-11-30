FROM node:12

WORKDIR /app/app-node

COPY ./package.json ./

RUN npm install

COPY . .
COPY ../client/build ../client/build


