/*
 * GET home page.
 */
exports.index = function(req, res) {
	req.session.voteAccess = true;
	res.sendfile('views/index.html');
};

exports.share = require('./share');