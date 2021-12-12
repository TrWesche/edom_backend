import * as expressSession from "express-session";
import * as redis from "redis";
import * as connectRedis from "connect-redis";
import * as config from "./redisConfig.json";

const session = expressSession;
const redisStore = connectRedis(session);
const redisClient = redis.createClient({
    host: config.host,
    port: config.port,
    password: config.secret
});
const redisConfig = config;

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

export {
    session,
    redisStore,
    redisClient,
    redisConfig
};