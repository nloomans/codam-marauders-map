import * as http from 'http'
import next = require('next');

import express = require('express');

import * as redis from 'redis';
import makeIo = require('socket.io');

import makeSession from './session';
import pull from './pull';
import { Locations } from '../types';
import getSessionStatus from '../utils/getSessionStatus';

const dev = process.env.NODE_ENV !== 'production';
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
    let locations: Locations = {};

    pull(newLocations => {
        locations = newLocations;
        console.log(`Sending locations to ${Object.keys(io.sockets.connected).length} clients`);
        io.emit('locations', locations);
    }).catch(exitWithError);

    io.on('connection', (socket) => {
        if (locations) {
            console.log('Client connected, sending locations');
            socket.emit('locations', locations);
        } else {
            console.log('Client connected, locations not ready yet');
        }
    });

    app.get('/api/session/status', (req, res) => {
        res.json(getSessionStatus(req));
    });

    app.get('/whoami', (req, res) => {
        res.json(req.user);
    });

    app.get('*', (req, res) => {
        return handle(req, res);
    });

    httpServer.listen(port, () => {
        console.log(` > Ready on http://localhost:${port}`);
    });
}

function exitWithError(ex: Error) {
    console.error(ex.stack);
    process.exit(1)
}

nextInstance.prepare().then(main).catch(exitWithError);
