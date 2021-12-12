"use strict";
exports.__esModule = true;
var mqtt = require("mqtt");
var config_1 = require("../config/config");
var mqttHandler = function () {
    if (config_1.mqttEnable) {
        console.log("MQTT Enabled: Intializing Connection");
        var client = mqtt.connect(config_1.mqttBrokerAddress);
        client.on("connect", function () {
            console.log("MQTT Connected");
        });
        client.on("disconnect", function () {
            console.log("MQTT Disconnected");
        });
        client.on("message", function (topic, message) {
            console.log("Message Received");
            console.log(topic);
            console.log(message);
        });
        return client;
    }
    else {
        console.log("MQTT Not Enabled: Skipping Initialization");
        return null;
    }
};
exports["default"] = mqttHandler;
//# sourceMappingURL=mqtt.js.map