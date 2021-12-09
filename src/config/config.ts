import {config} from "dotenv";

config();

const port = +process.env.PORT || 3001;

const mqttEnable = false;
const mqttBrokerAddress = "mqtt://test.mosquitto.org";

const wsEnable = true;
const wsPort = +process.env.wsPort || 3002;

const bcrypt_work_factor = 12;

const private_key = "temp";

export {
    port,
    mqttEnable,
    mqttBrokerAddress,
    wsEnable,
    wsPort,
    bcrypt_work_factor,
    private_key
};