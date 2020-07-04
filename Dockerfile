FROM node:12.16.1-alpine
ENV NODE_ENV production

RUN apk upgrade -U -a

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY dist /usr/src/app
COPY node_modules /usr/src/app/node_modules

EXPOSE 8080
CMD ["node", "app.js"]