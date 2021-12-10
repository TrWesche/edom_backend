import {config} from "dotenv";

config();

const port = process.env.PORT ? +process.env.PORT : 3001;
const nodeEnv = process.env.NODEENV ? process.env.NODEENV : "dev";

const mqttEnable = false;
const mqttBrokerAddress = "mqtt://test.mosquitto.org";

const wsEnable = true;
const wsPort = process.env.WSPORT ? +process.env.WSPORT : 3002;

const pgDBURI = process.env.PGDBURI ? process.env.PGDBURI : "https://localhost:4000";
const redisDBURI = process.env.REDISDBURI ? process.env.REDISDBURI : "https://localhost:4100";

const bcrypt_work_factor = 12;
const private_key = "temp";

export {
    port,
    nodeEnv,
    mqttEnable,
    mqttBrokerAddress,
    wsEnable,
    wsPort,
    pgDBURI,
    redisDBURI,
    bcrypt_work_factor,
    private_key
};