/*
 * GET home page.
 */
exports.index = function(req, res) {
	if (req.headers['x-real-ip']) {
		console.log(req.headers['x-real-ip'], req.headers['x-forwarded-for']);
	}
	res.sendfile('views/index.html');
	req.session.voteAccess = true;
};

exports.share = require('./share');