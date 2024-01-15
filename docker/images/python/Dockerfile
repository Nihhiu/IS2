FROM python:3.12.1-alpine

WORKDIR /usr/src/app

# install bash
RUN apk add bash

# install dependencies to communicate with postgres datbases
RUN apk add postgresql-dev gcc python3-dev musl-dev

# install nodemon
RUN apk add --update nodejs npm
RUN npm update npm -g
RUN npm install nodemon -g

# upgrade pip
RUN python -m pip install --upgrade pip

# install uuid
RUN pip install uuid

RUN pip install lxml

RUN pip install python-dotenv

RUN pip install pika

RUN pip install Flask-Cors

# dependencies
COPY ./requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# run the script
CMD (sed -i 's/\r$//' ./run.sh) && (chmod +x ./run.sh) && (./run.sh)