"use strict";
exports.__esModule = true;
// Library Imports
var express = require("express");
var https = require("https");
var cors = require("cors");
var mqtt_1 = require("./communication/mqtt");
var websocket_1 = require("./communication/websocket");
var config_1 = require("./config/config");
// Router Imports
var userRouter_1 = require("./routers/userRouter");
var userRoomRouter_1 = require("./routers/userRoomRouter");
var userEquipRouter_1 = require("./routers/userEquipRouter");
var groupRouter_1 = require("./routers/groupRouter");
var groupRoomRouter_1 = require("./routers/groupRoomRouter");
var groupEquipRouter_1 = require("./routers/groupEquipRouter");
// Middleware Imports
var authorizationMW_1 = require("./middleware/authorizationMW");
var groupMW_1 = require("./middleware/groupMW");
// Database Connector Imports
var redis_1 = require("./databases/redisSession/redis");
var corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    methods: ['GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: true,
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization,Set-Cookie',
    exposedHeaders: 'Content-Range,X-Content-Range'
};
// const host = hostname();
var host = "localhost";
var app = express();
var server = https.createServer({ key: config_1.privatekey, cert: config_1.certificate }, app);
(0, websocket_1["default"])(server);
(0, mqtt_1["default"])();
app.use(express.json());
app.use(cors(corsOptions));
app.use(authorizationMW_1["default"].loadJWT);
app.use(authorizationMW_1["default"].loadSitePermissions);
app.use((0, redis_1.session)({
    secret: config_1.sessionSecret,
    store: new redis_1.redisStore({
        client: redis_1.redisClient
    }),
    saveUninitialized: redis_1.redisConfig.saveUninitialized,
    resave: redis_1.redisConfig.resave
}));
app.use("/user", userRouter_1["default"]);
app.use("/user/equip", authorizationMW_1["default"].loadSitePermissions, userEquipRouter_1["default"]);
app.use("/user/room", authorizationMW_1["default"].loadSitePermissions, userRoomRouter_1["default"]);
app.use("/group", groupRouter_1["default"]);
app.use("/group/:groupID/equip", groupMW_1["default"].addGroupIDToRequest, authorizationMW_1["default"].loadSitePermissions, authorizationMW_1["default"].loadGroupPermissions, groupEquipRouter_1["default"]);
app.use("/group/:groupID/room", groupMW_1["default"].addGroupIDToRequest, authorizationMW_1["default"].loadSitePermissions, authorizationMW_1["default"].loadGroupPermissions, groupRoomRouter_1["default"]);
server.listen(config_1.port, host, function () {
    console.log("Example app listening at https://".concat(host, ":").concat(config_1.port));
});
//# sourceMappingURL=server.js.map