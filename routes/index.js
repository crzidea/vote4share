/*
 * GET home page.
 */
exports.index = function(req, res) {
	console.log(req.connection.remoteAddress);
	res.sendfile('views/index.html');
	req.session.voteAccess = true;
};

exports.share = require('./share');