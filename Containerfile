FROM docker.io/library/node:alpine
RUN apk --no-cache add chromium
RUN npm install -g @angular/cli
