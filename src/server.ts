// Library Imports
import * as express from "express";
import * as https from "https";
import * as cors from "cors";

import mqttHandler from "./communication/mqtt";
import wssHandler from "./communication/websocket";

// Global Variable Imports
import { hostname } from "os";
import { certificate, port, privatekey, sessionSecret } from "./config/config";

// Router Imports
import equipRouter from "./routers/equipRouter";
import roomRouter from "./routers/roomRouter";

import userRouter from "./routers/userRouter";
import userRoomRouter from "./routers/userRoomRouter";
import userEquipRouter from "./routers/userEquipRouter";

import groupRouter from "./routers/groupRouter";
import groupRoomRouter from "./routers/groupRoomRouter";
import groupEquipRouter from "./routers/groupEquipRouter";
import groupMgmtRouter from "./routers/groupMgmtRouter";

// Middleware Imports
import authMW from "./middleware/authorizationMW";
import groupMW from "./middleware/groupMW";

// Database Connector Imports
import { session, redisClient, redisConfig, redisStore } from "./databases/redisSession/redis";



const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    methods: ['GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: true,
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization,Set-Cookie',
    exposedHeaders: 'Content-Range,X-Content-Range'
}

// const host = hostname();
const host = "localhost"

const app = express();
const server = https.createServer({ key: privatekey, cert: certificate}, app);
wssHandler(server);
mqttHandler();

app.use(express.json());
app.use(cors(corsOptions));
app.use(authMW.loadJWT);
app.use(authMW.loadSitePermissions);
app.use(session({
    secret: sessionSecret,
    store: new redisStore({
        client: redisClient
    }),
    saveUninitialized: redisConfig.saveUninitialized,
    resave: redisConfig.resave
}))

app.use("/equips", equipRouter);
app.use("/rooms", roomRouter);

app.use("/users/equips", authMW.loadSitePermissions, userEquipRouter);
app.use("/users/rooms", authMW.loadSitePermissions, userRoomRouter);
app.use("/users", authMW.loadSitePermissions, userRouter);

// app.use("/groups/:groupID/equips", groupMW.addGroupIDToRequest, authMW.loadSitePermissions, authMW.loadGroupPermissions, groupEquipRouter);
// app.use("/groups/:groupID/rooms", groupMW.addGroupIDToRequest, authMW.loadSitePermissions, authMW.loadGroupPermissions, groupRoomRouter);
// app.use("/groups/:groupID/mgmt", groupMW.addGroupIDToRequest, authMW.loadSitePermissions, authMW.loadGroupPermissions, groupMgmtRouter);
app.use("/groups", authMW.loadSitePermissions, groupRouter);

server.listen(port, host, () => {
    console.log(`Example app listening at https://${host}:${port}`);
})
