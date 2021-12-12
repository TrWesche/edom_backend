import * as expressSession from "express-session";
import * as redis from "redis";
import * as connectRedis from "connect-redis";
import * as config from "./redisConfig.json";

const session = expressSession;
const redisStore = connectRedis(session);
const redisClient = redis.createClient();
const redisConfig = config;


export {
    session,
    redisStore,
    redisClient,
    redisConfig
};