// Library Imports
import * as express from "express";
import * as https from "https";
import { readFileSync } from "fs";
import { join as pathJoin } from "path";
import * as cors from "cors";

import mqttHandler from "./communication/mqtt";
import wssHandler from "./communication/websocket";

// Global Variable Imports
import { hostname } from "os";
import { port } from "./config/config";

// Router Imports
import roomRouter from "./routers/roomRouter";
import userRouter from "./routers/userRouter";

// Middleware Imports
import { authenticateJWT } from "./middleware/authorizationMW";


const corsOptions = {
    origin: "http://u0134-m21p-01:3000",
    optionsSuccessStatus: 200,
    methods: ['GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: true,
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization,Set-Cookie',
    exposedHeaders: 'Content-Range,X-Content-Range'
}

const key = readFileSync(pathJoin(__dirname+"/certs/key.pem"));
const certificate = readFileSync(pathJoin(__dirname+"/certs/cert.pem"));
const host = hostname();
// const host = "localhost"

const app = express();
const server = https.createServer({ key: key, cert: certificate }, app);
wssHandler(server);
mqttHandler();

app.use(express.json());
app.use(cors(corsOptions));
app.use(authenticateJWT);
app.use("/user", userRouter);
app.use("/room", roomRouter);

server.listen(port, host, () => {
    console.log(`Example app listening at https://${host}:${port}`);
})
