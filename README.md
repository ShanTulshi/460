# yasha_game

This project is a simple wargame, meant to teach C & Linux basics.

The project is set up into two main folders: `infra` and `web`.

**Warning: This project is no longer maintained, and has security vulnerabilities. Deploy at your own risk.**

## infra

This contains all of the infrastructure supporting the project.
- The Dockerfile is used to build the container that users log into when they use the online terminal, and is built with: `docker build -t wetty .`
- `create_entry_script.sh` is used to create an entry script for each new user that creates an account on the wargame site. Each user needs it to make sure their account puts them directly into the container with the proper working directory and permissions set up.

## web

This contains all of the webserver code for the wargame.

- `frontend` contains a simple Jekyll site that is used to build the challenge pages. Each challenge is written as a markdown file. To build, `cd web` and then `yarn run build`. It will automatically build the Jekyll site into `frontend/_site`.
- There is a component, `wetty`, which we forked and expanded for this project. It allows users to `ssh` into the server (and directly into the Docker container) from their web browser.
- The rest of the node server provides user accounts, challenge tracking, and solution checking. The web server can be run with `yarn run start`, and requires `sudo` to read from the SSL certificates provided by Let's Encrypt and to build the user account on the server when someone makes an account.
