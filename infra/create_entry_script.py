#!/usr/bin/env python3
import os
import sys
import logging

template = """#!/bin/bash

docker run -v /home/{0}/workdir:/home/war --cpu-shares=500 -m 40m --memory-swap=40m --hostname=yasha -it wetty bash
"""

def create_entry_script(username):
    with open('/home/{}/entry_script.sh'.format(username), 'w+') as f:
        f.write(template.format(username))
    os.chmod('/home/{}/entry_script.sh'.format(username), 0o755)
    print('Created  /home/{}/entry_script.sh successfully!'.format(username))

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: {} USERNAME".format(__file__))
        exit(1)
    try:
        create_entry_script(sys.argv[1])
    except Exception as e:
        logging.exception("Error in {}".format(__file__))
        exit(1)
