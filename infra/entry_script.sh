#!/bin/bash

docker run -v /home/test:/home/test --net=bridge --cpu-shares=500 -m 40m --memory-swap=40m --hostname=yasha -it wetty bash
