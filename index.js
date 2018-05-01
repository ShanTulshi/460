let express = require('express'),
		mongoose = require('mongoose'),
		bodyParser = require('body-parser'),
		wetty = require('./wetty/'),
		passport = require('passport'),
		LocalStrategy = require('passport-local')
		;
app = express();

app.use(bodyParser.urlencoded({
	extended: true,
}));
app.use(bodyParser.json());

app.use('/term', )
app.use('/', express.static(__dirname + '/frontend/_site/'))
app.use('/assets', express.static(__dirname + '/frontend/assets'));
