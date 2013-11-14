var redisClient = require('../lib/redis')
    , keyPrefix = require('../config').keyPrefix
    , idKey = 'shareid';

/**
 * GET: /share
 */
exports.list = function (req, res) {

    var share = [];
    redisClient.keys(
        keyPrefix + '*',
        function (err, replies) {
            var got = 0;
            replies.forEach(function (key) {
                redisClient.hgetall(key, function (err, reply) {
                    reply.subjects = JSON.parse(reply.subjects);
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
exports.votes = function (req, res) {
    redisClient.hincrby(
        keyPrefix + req.params.id, 'votes', 1,
        function (err, reply) {
            res.json({votes: reply});
        }
    )
};

/**
 * POST /share
 */
exports.add = function (req, res) {
    redisClient.incr(idKey, function (err, id) {
        req.body.id = id;
        req.body.votes = 0;
        req.body.subjects = JSON.stringify(req.body.subjects);

        redisClient.hmset(keyPrefix+id, req.body, function (err, reply) {
            res.json({id:id})
        })
    })
};

/**
 * DELETE /share/:id
 */
exports.del = function (req, res) {
    redisClient.del(keyPrefix+req.params.id, function (err, reply) {
        res.json(reply);
    })
};