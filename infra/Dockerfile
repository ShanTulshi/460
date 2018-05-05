FROM ubuntu:latest

RUN apt-get update
RUN apt-get -y install vim

#RUN useradd --create-home --shell /bin/bash test
RUN useradd --shell /bin/bash test

USER test
WORKDIR /home/test

ADD bashrc /home/test/.bashrc
