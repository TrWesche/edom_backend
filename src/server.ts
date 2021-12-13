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
import roomRouter from "./routers/roomRouter";
import userRouter from "./routers/userRouter";

// Middleware Imports
import { validateJWT } from "./middleware/authorizationMW";

// Database Connector Imports
import { session, redisClient, redisConfig, redisStore } from "./databases/redisSession/redis";

const corsOptions = {
    origin: "http://u0134-m21p-01:3000",
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
const server = https.createServer({ key: privatekey, cert: certificate}, app)
wssHandler(server);
mqttHandler();

app.use(express.json());
app.use(cors(corsOptions));
app.use(validateJWT);
app.use(session({
    secret: sessionSecret,
    store: new redisStore({
        client: redisClient
    }),
    saveUninitialized: redisConfig.saveUninitialized,
    resave: redisConfig.resave
}))

app.use("/user", userRouter);
app.use("/room", roomRouter);

server.listen(port, host, () => {
    console.log(`Example app listening at https://${host}:${port}`);
})
