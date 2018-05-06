let     express = require('express'),
		router = express.Router()
	;

const checkExistence = (() => {
	var solutions = require('./sols.js')	// Keep sols.js private
	return (sol, challenge) => {solutions[challenge] === sol};
})();

const checker = {
	0: checkExistence,
};

router.get('/:num', (req, res) => {
	if(checker[req.params.num])
		res.send(checker[req.params.num](req.query.solution));
	else
		return
});

module.exports = router;
