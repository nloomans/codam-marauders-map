if (process.env.UID === undefined || process.env.SECRET === undefined) {
    throw new Error("Missing UID or SECRET env. Do you have a .env file?");
}

module.exports = {
    SECRET: process.env.SECRET,
    UID: process.env.UID,
    CALLBACK_URL: process.env.CALLBACK_URL
        || "http://localhost:3000/auth/callback",
};
