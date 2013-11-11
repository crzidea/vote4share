var config = require('../config')
    , redisClient = require('redis').createClient(config.redis.port, config.redis.host)

redisClient.auth(config.redis.password)

module.exports = redisClient;