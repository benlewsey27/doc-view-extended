FROM node:15.8-alpine as builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/build/ /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./src/nginx.conf /etc/nginx/conf.d
