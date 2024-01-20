FROM golang:1.21.5-alpine3.19

WORKDIR /usr/src/app

RUN apk add bash

RUN apk add --update nodejs npm
RUN npm update npm -g
RUN npm install nodemon -g

COPY run.sh .
RUN sed -i 's/\r$//' ./run.sh
RUN chmod +x ./run.sh

ENTRYPOINT ["./run.sh"]
