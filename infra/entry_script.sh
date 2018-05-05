#!/bin/bash

#docker run -v /home/test:/home/test --cpu-shares=500 -m 40m --memory-swap=40m --hostname=yasha -it 7f3f6d47fe26 bash
docker run -v /home/test:/home/test --cpu-shares=500 -m 40m --memory-swap=40m --hostname=yasha -it wetty bash
