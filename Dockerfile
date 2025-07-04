FROM node:20-alpine


ARG DATABASE_URL
ARG EDGE_STORE_ACCESS_KEY
ARG EDGE_STORE_SECRET_KEY
ARG NEXT_PUBLIC_GROQ_API_KEY

ENV DATABASE_URL=${DATABASE_URL}
ENV EDGE_STORE_ACCESS_KEY=${EDGE_STORE_ACCESS_KEY}
ENV EDGE_STORE_SECRET_KEY=${EDGE_STORE_SECRET_KEY}
ENV NEXT_PUBLIC_GROQ_API_KEY=${NEXT_PUBLIC_GROQ_API_KEY}

WORKDIR /usr/src/app

COPY ./package.json ./package.json

COPY . .

RUN npm install --legacy-peer-deps
RUN npm run postinstall
RUN DATABASE_URL=${DATABASE_URL} npm run build

EXPOSE 3000

CMD [ "npm", "start" ]

