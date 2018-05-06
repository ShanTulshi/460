let express = require('express'),
		router = express.Router()
	;

const checkExistence = ((challenge, solfile = './sol0.js') => {
	let solutions = require(solfile)	// Keep sols.js private
	return (sol) => {
		return solutions[challenge] === sol
	};
});

const checker = {
	0: checkExistence(0),
};

router.get('/:num', (req, res) => {
	let result = false;
	if(checker[req.params.num]) {
		if(result = checker[req.params.num](req.query.attempt)) {
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

module.exports = router;
