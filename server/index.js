const http = require("http");
const next = require("next");

const express = require("express");

const redis = require("redis");
const makeIo = require("socket.io");

const getSessionStatus = require("../utils/getSessionStatus");
const pull = require("./pull");
const makeSession = require("./session");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const nextInstance = next({ dev });
const handle = nextInstance.getRequestHandler();
const app = express();
const httpServer = new http.Server(app);
const io = makeIo(httpServer);
const redisClient = redis.createClient();

const session = makeSession(redisClient);
app.use(session.express());
io.use(session.socketIo());

function main() {
    let locations = {};

    pull((newLocations) => {
        locations = newLocations;
        console.log(`Sending locations to ${Object.keys(io.sockets.connected).length} clients`);
        io.emit("locations", locations);
    }).catch(exitWithError);

    io.on("connection", (socket) => {
        if (locations) {
            console.log("Client connected, sending locations");
            socket.emit("locations", locations);
        } else {
            console.log("Client connected, locations not ready yet");
        }
    });

    app.get("/api/session/status", (req, res) => {
        res.json(getSessionStatus(req));
    });

    app.get("/whoami", (req, res) => {
        res.json(req.user);
    });

    app.get("*", (req, res) => {
        return handle(req, res);
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
}

function exitWithError(ex) {
    console.error(ex.stack);
    process.exit(1);
}

nextInstance.prepare().then(main).catch(exitWithError);
