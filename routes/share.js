var redisClient = require('../lib/redis'),
    config = require('../config'),
    keyPrefix = config.keyPrefix,
    idKey = config.idKey;

/**
 * GET: /share
 */
exports.list = function(req, res) {

    var share = [];
    redisClient.keys(
        keyPrefix + '*',
        function(err, replies) {
            if (err) return;
            var got = 0;
            replies.forEach(function(key) {
                redisClient.hgetall(key, function(err, reply) {
                    try {
                        reply.subjects = JSON.parse(reply.subjects);
                    } catch (e) {
                        console.log(key);
                    }
                    share.push(reply);
                    ++got == replies.length && res.json(share);
                })
            })
        }
    )
};

/**
 * POST /share/:id/votes
 */
exports.votes = function(req, res) {
    var remoteAddr = req.headers['x-real-ip'];
    redisClient.get('ip:' + remoteAddr, function(err, reply) {
        if (reply || !req.session.voteAccess || req.session.voted) {
            res.json({
                votes: -1
            });
        } else {
            redisClient.hincrby(
                keyPrefix + req.params.id, 'votes', 1,
                function(err, reply) {
                    if (err) return
                    req.session.voted = true;
                    res.json({
                        votes: reply
                    });
                }
            )
            console.log(remoteAddr, req.params.id, Date.now());
            redisClient.setex('ip:' + remoteAddr, config.sessionTtl, Date.now());
        }
    })
};

/**
 * POST /share
 */
exports.add = function(req, res) {
    redisClient.incr(idKey, function(err, id) {
        req.body.id = id;
        req.body.votes = 0;
        req.body.subjects = JSON.stringify(req.body.subjects);

        redisClient.hmset(keyPrefix + id, req.body, function(err, reply) {
            if (err) return;
            res.json({
                id: id
            })
        })
    })
};

/**
 * DELETE /share/:id
 */
exports.del = function(req, res) {
    redisClient.del(keyPrefix + req.params.id, function(err, reply) {
        if (err) return;
        res.json(reply);
    })
};