FROM node:20-alpine

ARG DB_URL

WORKDIR /usr/src/app

COPY ./package.json ./package.json

COPY . .

RUN npm install --legacy-peer-deps
RUN npm run postinstall
RUN DB_URL=${DB_URL} npm run build

EXPOSE 3000

CMD [ "npm", "start" ]

