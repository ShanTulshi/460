let     express = require('express'),
		router = express.Router(),
		cmd = require('node-cmd'),
		config = require('./config.js')
	;

const mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/users';
let MongoClient = require('mongodb').MongoClient;

module.exports = (opts) => {

	const checkExistence = ((challenge, solfile = './sols/sol0.js') => {
		let solutions = require(solfile)	// Keep sols.js private
		return (sol) => {
			return solutions[challenge] === sol
		};
	});

	const checker = {
		0: checkExistence(0, './sols/sol0.js'),
	};

	router.get('/:num', (req, res) => {
		console.log('checking answer for ' + req.params.num);
		let result = false;
		if(checker[req.params.num]) {
			if((result = checker[req.params.num](req.query.attempt)) == true) {
				MongoClient.connect(mongodbUrl, (err, database) => {
					var db = database.db('local');
				  let collection = db.collection('localUsers');
					collection.update({username: req.user.username}, {challenge: req.params.num + 1})
					.then(() => {
						res.status(200)
						.json({result: result})
						.send();
					});
				});
			} else {
				res.status(202)
					.json({result: result})
					.send();
			}
		} else
			res.sendStatus(404);
	});

	if(opts) {

		cmd.get('ifconfig docker0 | cut -d "\n" -f2 | cut -d: -f2 | cut -d " " -f1', (err, data, stderr) => {
			if(err) {
				console.log('ifconfig command error', err);
			} else {
				const ip = ((opts.ip) ? opts.ip : data.slice(0, -1));
				const port = 8081;

				let app = express();

				function ensureAuthenticated(req, res, next) {
				  if (req.isAuthenticated()) { return next(); }
				  req.session.error = 'Please sign in!';
				  res.redirect('/signin');
				}

				app.use('', ensureAuthenticated, router);
				app.listen(port, ip);
				console.log('checker listening on', ip + ':' + port);
			}
		});
	}
	else {
		return router;
	}

}
