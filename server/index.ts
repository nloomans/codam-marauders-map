import * as http from 'http'
import next = require('next');

import express = require('express');
import session = require('express-session');
import cookieParser = require('cookie-parser');
import * as bodyParser from 'body-parser';

import * as redis from 'redis';
import makeRedisStore = require('connect-redis');

import makeIo = require('socket.io');

import * as passport from 'passport';
import FortyTwoStrategy = require('passport-42');

import pull from './pull';
import { Locations } from '../types';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const nextInstance = next({ dev });
const handle = nextInstance.getRequestHandler();
const app = express();
const httpServer = new http.Server(app);
const io = makeIo(httpServer);
const redisClient = redis.createClient();
const RedisStore = makeRedisStore(session);

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

    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: 'TODO: Replace this with something randomly generated',
        resave: false,
        saveUninitialized: false,
    }));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(passport.initialize());
    app.use(passport.session());

    if (process.env.UID === undefined || process.env.SECRET === undefined) {
        throw "Missing UID or SECRET env. Do you have a .env file?";
    }

    passport.use(new FortyTwoStrategy(
        {
            clientID: process.env.UID,
            clientSecret: process.env.SECRET,
            callbackURL: 'http://localhost:3000/auth/callback',
        },
        (_accessToken, _refreshToken, profile, cb) => {
            cb(null, { id: profile.id, login: profile.username });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    app.get('/auth', passport.authenticate('42'));
    app.get('/auth/callback',
        passport.authenticate('42', { failureRedirect: '/login-failed' }),
        (_req, res) => res.redirect('/'),
    );

    app.get('/whoami',
        (req, res) => {
            res.json(req.user);
        }
    );

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
