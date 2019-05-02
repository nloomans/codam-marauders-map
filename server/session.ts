import { Router } from 'express';
import session = require('express-session');
import cookieParser = require('cookie-parser');
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import FortyTwoStrategy = require('passport-42');
import passportSocketIo = require('passport.socketio');
import { RedisClient } from 'redis';
import makeRedisStore = require('connect-redis');

import env from './env';

const SESSION_SECRET = 'TODO: Replace this with something randomly generated';

export default (redisClient: RedisClient) => {
    const RedisStore = makeRedisStore(session);
    const store = new RedisStore({ client: redisClient });

    return {
        express: () => {
            const app = Router();

            app.use(session({
                store,
                secret: SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
            }));
            app.use(cookieParser());
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(passport.initialize());
            app.use(passport.session());

            passport.use(new FortyTwoStrategy(
                {
                    clientID: env.UID,
                    clientSecret: env.SECRET,
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

            return app;
        },

        socketIo: () =>
            passportSocketIo.authorize({
                cookieParser: cookieParser,
                key: 'connect.sid',
                secret: SESSION_SECRET,
                store,
            }),
    }
};
