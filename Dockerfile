FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN apt-get update

RUN apt-get install -y nginx

COPY nginx.conf /etc/nginx/sites-enabled/default

RUN yarn install && yarn build

EXPOSE 3000 8080

CMD /usr/sbin/nginx; yarn start