import { config } from "dotenv";
import { readFileSync } from "fs";
import { join as pathJoin } from "path";

config();

const certPath = "C:/local_repos/edom/server_edom_backend/dist/certs/"

const certificate = readFileSync(pathJoin(certPath+"cert.pem"));
const privatekey = readFileSync(pathJoin(certPath+"privatekey.pem"));
const publickey = readFileSync(pathJoin(certPath+"publickey.pem"));

const port = process.env.PORT ? +process.env.PORT : 3001;
const nodeEnv = process.env.NODEENV ? process.env.NODEENV : "dev";

const mqttEnable = false;
const mqttBrokerAddress = "mqtt://test.mosquitto.org";

const wsEnable = true;
const wsPort = process.env.WSPORT ? +process.env.WSPORT : 3002;

const sessionSecret = process.env.SESSNION_SECRET ? process.env.SESSNION_SECRET : "test";

const bcrypt_work_factor = 12;

export {
    certificate,
    privatekey,
    publickey,
    port,
    nodeEnv,
    mqttEnable,
    mqttBrokerAddress,
    wsEnable,
    wsPort,
    sessionSecret,
    bcrypt_work_factor
};