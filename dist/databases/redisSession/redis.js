"use strict";
exports.__esModule = true;
exports.redisConfig = exports.redisClient = exports.redisStore = exports.session = void 0;
var expressSession = require("express-session");
var redis = require("redis");
var connectRedis = require("connect-redis");
var config = require("./redisConfig.json");
var session = expressSession;
exports.session = session;
var redisStore = connectRedis(session);
exports.redisStore = redisStore;
var redisClient = redis.createClient({
    host: config.host,
    port: config.port,
    password: config.secret
});
exports.redisClient = redisClient;
var redisConfig = config;
exports.redisConfig = redisConfig;
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});
//# sourceMappingURL=redis.js.map