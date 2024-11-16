"use strict";
exports.__esModule = true;
var express_1 = require("express");
var express_session_1 = require("express-session");
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
app.use((0, express_session_1["default"])(// session object middleware
{
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false
}));
// test users in memory
var users = [
    { id: 1, name: 'John', password: "doe" },
    { id: 2, name: 'Josh', password: "deo" }
];
var b_listUsers = []; // blocked users [It just stores id of users]
app.post('/login', function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password;
    var user = users.find(function (u) { return username === u.name && password === u.password; });
    console.debug(req.body, user);
    if (!user) {
        res.status(401).send("Unauthorized access");
        return;
    }
    if (b_listUsers.includes(user)) {
        res.status(403).send("Unaccessible user");
        return;
    }
    req.session.userId = user.id;
    res.status(202).send({ "id": user.id, "name": user.name });
});
app.post('/logout', function (req, res) {
    var _a;
    (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy(function () {
        res.status(204).send("You are successfully logged out");
    });
});
app.get('/pro', function (req, res) {
    var _a;
    // Authorization using the session request
    var userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
    if (userId) {
        var user = users.find(function (u) { return u.id === userId; });
        if (b_listUsers.includes(user)) {
            res.status(403).send("Unaccessible user");
            return;
        }
        res.status(200).send({ "ID": userId, "Name": user === null || user === void 0 ? void 0 : user.name, "pass": user === null || user === void 0 ? void 0 : user.password });
    }
    else {
        console.warn("User ".concat(userId, " not found"));
        res.status(400).send("Oops! User not found");
    }
});
app.get("/blocks", function (req, res) {
    var userId = req.params.user;
    var user = users.find(function (u) { return u.id === Number(userId); });
    if (!user) {
        res.status(400).send("User not found");
        return;
    }
    b_listUsers.push({ id: user.id });
    res.send("user blocked!");
});
app.get("/", function (req, res) {
    res.send({ "Hello": "World!" });
});
app.listen(3015, function () {
    console.log('listening on http://localhost:3015');
});
