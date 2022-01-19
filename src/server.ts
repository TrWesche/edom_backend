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
import equipRootRouter from "./routers/equipRootRouter";
import roomRootRouter from "./routers/roomRootRouter";
import userRootRouter from "./routers/userRootRouter";
import groupRootRouter from "./routers/groupRootRouter";

// Middleware Imports
import authMW from "./middleware/authorizationMW";

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
app.use(session({
    secret: sessionSecret,
    store: new redisStore({
        client: redisClient
    }),
    saveUninitialized: redisConfig.saveUninitialized,
    resave: redisConfig.resave
}))

app.use("/equips", equipRootRouter);
app.use("/rooms", roomRootRouter);
app.use("/users", authMW.loadSitePermissions, userRootRouter);
app.use("/groups", authMW.loadSitePermissions, groupRootRouter);

server.listen(port, host, () => {
    console.log(`Example app listening at https://${host}:${port}`);
})
