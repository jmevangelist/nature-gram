FROM docker.io/library/node:alpine
RUN apk update
RUN apk upgrade
RUN apk add chromium
RUN npm install -g @angular/cli
