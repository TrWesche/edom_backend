import * as mqtt from "mqtt";
import { mqttEnable, mqttBrokerAddress } from "../config/config";

const mqttHandler = () => {
    if (mqttEnable) {
        console.log("MQTT Enabled: Intializing Connection");
        const client = mqtt.connect(mqttBrokerAddress)

        client.on("connect", () => {
            console.log("MQTT Connected");
        });
    
        client.on("disconnect", () => {
            console.log("MQTT Disconnected");
        });
    
        client.on("message", (topic, message) => {
            console.log("Message Received");
            console.log(topic);
            console.log(message);
        })
    
        return client;
    } else {
        console.log("MQTT Not Enabled: Skipping Initialization");
        return null;
    }
}

export default mqttHandler;