FROM node:alpine as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build/ /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./src/nginx.conf /etc/nginx/conf.d
