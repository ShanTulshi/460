'use strict';

let express = require('express'),
		router = express.Router(),
		mongoose = require('mongoose'),
		bodyParser = require('body-parser'),
		wetty = require('./wetty/wetty'),
		passport = require('passport'),
		LocalStrategy = require('passport-local'),
		http = require('http'),
		https = require('https'),
		fs = require('fs'),
		path = require('path')
		;

const default_port = 8080;
let usehttps = false;
let sslconf, httpserv;

const opts = require('optimist')
	.options({
		sslkey: {
			demand: false,
			description: 'path to SSL key',
		},
		sslcert: {
			demand: false,
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

app.use(bodyParser.urlencoded({
	extended: true,
}));
app.use(bodyParser.json());

app.use('/wetty', wetty(httpserv, router, {
	sslkey: opts.sslkey,
	sslcert: opts.sslcert,
}));
app.use('/', express.static(__dirname + '/frontend/_site/'));
app.use('/assets', express.static(__dirname + '/frontend/assets'));

if(usehttps) {
	console.log('https on port ' + port);
	httpserv = https.createServer(sslconf, app);
}
else {
	console.log('http on port ' + port);
	httpserv = http.createServer(app);
}

httpserv.listen(port);
