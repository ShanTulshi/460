let     express = require('express'),
		router = express.Router(),
		cmd = require('node-cmd')
	;

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
		let result = false;
		if(checker[req.params.num]) {
			if((result = checker[req.params.num](req.query.attempt)) == true) {
				req.user.update({ challenge: req.params.num + 1 });
				res.status(200)
					.json({result: result})
					.send();
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
				const ip = ((opts.ip) ? opts.ip : data);
				const port = 8081;

				let app = express();

				function ensureAuthenticated(req, res, next) {
				  if (req.isAuthenticated()) { return next(); }
				  req.session.error = 'Please sign in!';
				  res.redirect('/signin');
				}

				app.use('/', ensureAuthenticated, router);
				app.listen(port, ip);
				console.log('checker listening on', ip + ':' + port);
			}
		});
	}
	else {
		return router;
	}

}
