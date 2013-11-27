/*
 * GET home page.
 */
exports.index = function(req, res) {
	res.sendfile('views/index.html');
	req.session.voteAccess = true;
};

exports.share = require('./share');