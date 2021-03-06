// Library Imports
import * as express from "express";
import * as https from "https";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";

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

// TODO: Need to diagnose how to get Postman working again
const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'https://localhost:3001']

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
    optionsSuccessStatus: 200,
    methods: ['GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: true,
    credentials: true,
    allowedHeaders: 'Content-Type,Set-Cookie',
    exposedHeaders: 'Content-Range,X-Content-Range'
}

// const host = hostname();
const host = "localhost"

const app = express();
const server = https.createServer({ key: privatekey, cert: certificate}, app);
wssHandler(server);
mqttHandler();

app.use(express.json());
app.use(cookieParser());
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
// app.use(authMW.loadUserPermissions);

app.use("/v1/equip", authMW.loadSitePermissions, equipRootRouter);
app.use("/v1/room", authMW.loadSitePermissions, roomRootRouter);
app.use("/v1/user", authMW.loadSitePermissions, userRootRouter);
app.use("/v1/group", authMW.loadSitePermissions, groupRootRouter);

app.use((error, req, res, next) => {
  // Error gets here
  console.log(error);
  res.json({
    errorMessage: error
  });
});

server.listen(port, host, () => {
    console.log(`Example app listening at https://${host}:${port}`);
})
