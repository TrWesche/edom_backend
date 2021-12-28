import { config } from "dotenv";
import { readFileSync } from "fs";
import { join as pathJoin, dirname } from "path";

config();
const certPath = dirname(__dirname);
// console.log(`certPath === ${certPath}`);
// const certPath = "C:/local_repos/edom/server_edom_backend/dist/certs/"

const certificate = readFileSync(pathJoin(certPath+"\\certs\\cert.pem"));
const privatekey = readFileSync(pathJoin(certPath+"\\certs\\privatekey.pem"));
const publickey = readFileSync(pathJoin(certPath+"\\certs\\publickey.pem"));

const port = process.env.PORT ? +process.env.PORT : 3001;
const nodeEnv = process.env.NODEENV ? process.env.NODEENV : "dev";

const mqttEnable = false;
const mqttBrokerAddress = "mqtt://test.mosquitto.org";

const wsEnable = true;
const wsPort = process.env.WSPORT ? +process.env.WSPORT : 3002;

const sessionSecret = process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "test";

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