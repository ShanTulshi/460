let express = require('express'),
		router = express.Router()
	;

const checkExistence = ((challenge, solfile = './sols.js') => {
	let solutions = require(solfile)	// Keep sols.js private
	return (sol) => {
		return solutions[challenge] === sol
	};
});

const checker = {
	0: checkExistence(0),
};

router.get('/:num', (req, res) => {
	if(checker[req.params.num]) {
		res.status(202)
			.json({result: checker[req.params.num](req.query.attempt)})
			.send();
	} else
		res.sendStatus(403);
});

module.exports = router;
