module.exports = function getSessionStatus(req) {
    if (req.user) {
        return { loggedIn: true, login: req.user.login };
    } else {
        return { loggedIn: false };
    }
}
