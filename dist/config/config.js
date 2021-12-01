"use strict";
exports.__esModule = true;
exports.wsPort = exports.wsEnable = exports.mqttBrokerAddress = exports.mqttEnable = exports.port = void 0;
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var port = +process.env.PORT || 3001;
exports.port = port;
var mqttEnable = false;
exports.mqttEnable = mqttEnable;
var mqttBrokerAddress = "mqtt://test.mosquitto.org";
exports.mqttBrokerAddress = mqttBrokerAddress;
var wsEnable = true;
exports.wsEnable = wsEnable;
var wsPort = +process.env.wsPort || 3002;
exports.wsPort = wsPort;
//# sourceMappingURL=config.js.map