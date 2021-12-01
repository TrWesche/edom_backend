"use strict";
exports.__esModule = true;
// Library Imports
var express = require("express");
var https = require("https");
var fs_1 = require("fs");
var path_1 = require("path");
var cors = require("cors");
var mqtt_1 = require("./interfaces/mqtt");
var websocket_1 = require("./interfaces/websocket");
// Global Variable Imports
var os_1 = require("os");
var config_1 = require("./config/config");
// Router Imports
var roomRouter_1 = require("./routers/roomRouter");
var corsOptions = {
    origin: "http://u0134-m21p-01:3000",
    optionsSuccessStatus: 200,
    methods: ['GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: true,
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization,Set-Cookie',
    exposedHeaders: 'Content-Range,X-Content-Range'
};
var key = (0, fs_1.readFileSync)((0, path_1.join)(__dirname + "/certs/key.pem"));
var certificate = (0, fs_1.readFileSync)((0, path_1.join)(__dirname + "/certs/cert.pem"));
var host = (0, os_1.hostname)();
// const host = "localhost"
var app = express();
var server = https.createServer({ key: key, cert: certificate }, app);
(0, websocket_1["default"])(server);
(0, mqtt_1["default"])();
app.use(express.json());
app.use(cors(corsOptions));
app.use("/room", roomRouter_1["default"]);
server.listen(config_1.port, host, function () {
    console.log("Example app listening at https://".concat(host, ":").concat(config_1.port));
});
//# sourceMappingURL=server.js.map