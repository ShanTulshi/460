FROM ubuntu:latest

RUN apt-get update
RUN apt-get -y install vim gcc net-tools curl

# RUN useradd --create-home --shell /bin/bash test
# RUN groupadd players
# RUN useradd --shell /bin/bash --groups players war
RUN useradd --shell /bin/bash war

USER war
WORKDIR /home/war

ADD bashrc /home/war/.bashrc
