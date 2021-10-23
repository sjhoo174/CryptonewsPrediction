FROM python:3.6-slim-buster

WORKDIR /usr/src/app
COPY . .


RUN bash /usr/src/app/setup/init.sh

CMD bash /usr/src/app/setup/command.sh


