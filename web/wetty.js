// Copyright (c) 2014 Krishna Srinivas
// With modifications from our team.

'use strict';

let express = require('express'),
		mongoose = require('mongoose'),
		bodyParser = require('body-parser'),
		passport = require('passport'),
		LocalStrategy = require('passport-local'),
		http = require('http'),
		https = require('https'),
		fs = require('fs'),
		path = require('path'),
		pty = require('pty'),
		sockio = require('socket.io'),
		cmd = require('node-cmd')
;

let app = express.Router();
let sshport = 22;
let sshhost = 'localhost';
let sshauth = 'publickey,password,keyboard-interactive';
let idfile = '/etc/id_rsa';


module.exports = (opts, httpserv) => {
	if (opts.sshport) {
      sshport = opts.sshport;
  }

  if (opts.sshhost) {
      sshhost = opts.sshhost;
  }

  if (opts.sshauth) {
  	sshauth = opts.sshauth
  }

	if(opts.idfile) {
		idfile = opts.idfile;
	}

	app.get('/ssh/:user', (req, res) => {
        if (req.user.username != req.params.user) {
            res.sendStatus(403);
        }
		cmd.get('groups ' + req.params.user, (err, data, stderr) => {
			if(data.includes('players') > 0) {
				res.sendFile(__dirname + '/public/index.html');
			}
			else {
				res.sendStatus(403);
			}
		});
	});

	app.use('/', express.static(path.join(__dirname, '/public/wetty')));

	let io = sockio(httpserv, { path: '/wetty/socket.io' });
	io.on('connection', (socket) => {
		let sshuser = '';
		let match = null;
		const request = socket.request;
		console.log((new Date()) + ' Connection accepted.');
		if (match = request.headers.referer.match('/wetty/ssh/.+$')) {
				sshuser = match[0].replace('/wetty/ssh/', '') + '@';
		} else {
			console.log('Bad request: ' + request.headers.referer);
			return;
		}

		// if (process.getuid() == -1) {
		//     term = pty.spawn('/usr/bin/env', ['login'], {
		//         name: 'xterm-256color',
		//         cols: 80,
		//         rows: 30
		//     });
		// } else {
		let term = pty.spawn('ssh', [sshuser + sshhost, '-p', sshport, '-o', 'PreferredAuthentications=' + sshauth, '-o', 'IdentityFile=' + idfile], {
				name: 'xterm-256color',
				cols: 80,
				rows: 30
				}
			);
		// }
		console.log((new Date()) + " PID=" + term.pid + " STARTED on behalf of user=" + sshuser)
		term.on('data', (data) => {
				socket.emit('output', data);
		});
		term.on('exit', (code) => {
				console.log((new Date()) + " PID=" + term.pid + " ENDED")
		});
		socket.on('resize', (data) => {
				term.resize(data.col, data.row);
		});
		socket.on('input', (data) => {
				term.write(data);
		});
		socket.on('disconnect', () => {
				term.end();
		});
	});
	return app;
}
