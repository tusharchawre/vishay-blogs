FROM node:20-alpine


ARG DB_URL
ARG EDGE_STORE_ACCESS_KEY
ARG EDGE_STORE_SECRET_KEY

ENV DB_URL=${DB_URL}
ENV EDGE_STORE_ACCESS_KEY=${EDGE_STORE_ACCESS_KEY}
ENV EDGE_STORE_SECRET_KEY=${EDGE_STORE_SECRET_KEY}

RUN npm install --legacy-peer-deps
RUN npm run postinstall
RUN npm run build

WORKDIR /usr/src/app

COPY ./package.json ./package.json

COPY . .

RUN npm install --legacy-peer-deps
RUN npm run postinstall
RUN DB_URL=${DB_URL} npm run build

EXPOSE 3000

CMD [ "npm", "start" ]

