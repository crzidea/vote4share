var config = require('./config'),
	redisClient = require('redis').createClient(config.redis.port, config.redis.host);
redisClient.auth(config.redis.password);

function backup() {
	redisClient.keys('share:*', function(err, reply) {
		var votes = [],
			checked = 0,
			shareNum = reply.length;
		reply.forEach(function(key) {
			redisClient.hget(key, 'votes', function(err, reply) {
				votes.push({
					k: key,
					v: reply
				})
				if (++checked == shareNum) {
					onReady(votes);
				}
			})
		})
	})
}

function onReady(votes) {
	var key = 'backup ' + new Date
	console.log('votes on %s:', new Date);
	console.log(votes);
	redisClient.set(key, JSON.stringify(votes), function(err, reply) {
		console.log('saved');
	})
}

backup();
setInterval(backup, 3600000);