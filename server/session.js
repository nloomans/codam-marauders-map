const { Router } = require("express");
const bodyParser = require("body-parser");
const makeRedisStore = require("connect-redis");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const FortyTwoStrategy = require("passport-42");
const passportSocketIo = require("passport.socketio");
const env = require("./env");

const SESSION_SECRET = "TODO: Replace this with something randomly generated";

module.exports = (redisClient) => {
    const RedisStore = makeRedisStore(session);
    const store = new RedisStore({ client: redisClient });

    return {
        express: () => {
            const app = Router();

            app.use(session({
                resave: false,
                saveUninitialized: false,
                secret: SESSION_SECRET,
                store,
            }));
            app.use(cookieParser());
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(passport.initialize());
            app.use(passport.session());

            passport.use(new FortyTwoStrategy(
                {
                    callbackURL: env.CALLBACK_URL,
                    clientID: env.UID,
                    clientSecret: env.SECRET,
                },
                (_accessToken, _refreshToken, profile, cb) => {
                    cb(null, { id: profile.id, login: profile.username });
                },
            ));

            passport.serializeUser((user, done) => {
                done(null, user);
            });

            passport.deserializeUser((user, done) => {
                done(null, user);
            });

            app.get("/auth", passport.authenticate("42"));
            app.get("/auth/logout", (req, res) => {
                req.logout();
                res.redirect("/");
            });
            app.get("/auth/callback",
                passport.authenticate("42", { failureRedirect: "/login-failed" }),
                (_req, res) => res.redirect("/"),
            );

            return app;
        },

        socketIo: () =>
            passportSocketIo.authorize({
                cookieParser,
                key: "connect.sid",
                secret: SESSION_SECRET,
                store,
            }),
    };
};
