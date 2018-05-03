'use strict';

let express = require('express'),
		router = express.Router(),
		mongoose = require('mongoose'),
		bodyParser = require('body-parser'),
		wetty = require('./wetty'),
		passport = require('passport'),
		LocalStrategy = require('passport-local'),
		http = require('http'),
		https = require('https'),
		fs = require('fs'),
		path = require('path'),
		pty = require('pty'),
		sockio = require('socket.io')
		;

const default_port = 8080;
let usehttps = false;
let sshport = 22;
let sshhost = 'localhost';
let sshauth = 'password,keyboard-interactive';
let sockpath = '/wetty/socket.io/';
let globalsshuser = '';
let sslconf, httpserv;

const opts = require('optimist')
	.options({
		sslkey: {
			demand: true,
			description: 'path to SSL key',
		},
		sslcert: {
			demand: true,
			description: 'path to SSL cert',
		},
		port: {
			demand: false,
			description: 'port to run on. default: 8080',
		},
	}).boolean('allow_discovery').argv;

// Check params:
const port = ((opts.port) ? opts.port : default_port);

if(opts.sslkey && opts.sslcert) {
	usehttps = true;
	sslconf = {
		key: fs.readFileSync(path.resolve(opts.sslkey)),
		cert: fs.readFileSync(path.resolve(opts.sslcert)),
	};
}

let app = express();

if(usehttps) {
	console.log('https on port ' + port);
	httpserv = https.createServer(sslconf, app);
}
else {
	console.log('http on port ' + port);
	httpserv = http.createServer(app);
}

app.use(bodyParser.urlencoded({
	extended: true,
}));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/frontend/_site/'));

app.use('/wetty', wetty(opts, httpserv));

httpserv.listen(port);
