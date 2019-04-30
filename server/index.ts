import * as http from 'http'
import makeExpress = require('express');
import next = require('next');
import makeIo = require('socket.io');
import pull from './pull';
import { Locations } from '../types';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();
const express = makeExpress();
const httpServer = new http.Server(express);
const io = makeIo(httpServer);

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

    express.get('*', (req, res) => {
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

app.prepare().then(main).catch(exitWithError);
