import {config} from "dotenv";

config();

const port = +process.env.PORT || 3001;

const mqttEnable = false;
const mqttBrokerAddress = "mqtt://test.mosquitto.org";

const wsEnable = true;
const wsPort = +process.env.wsPort || 3002;

export {
    port,
    mqttEnable,
    mqttBrokerAddress,
    wsEnable,
    wsPort
};