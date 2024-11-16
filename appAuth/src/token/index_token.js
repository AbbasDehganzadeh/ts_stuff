"use strict";
exports.__esModule = true;
var express_1 = require("express");
var _a = require('jsonwebtoken'), sign = _a.sign, verify = _a.verify;
var PORT = process.env.PORT || 3016;
var secret_key = 'jwt-secret'; // ! NOTE: It should not be included in the source code
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
var users = [
    { id: 1, name: 'John', password: 'doe' },
    { id: 2, name: 'Jane', password: 'done' }
];
app.post('/login', function (req, res) {
    // get user credentials, validate, and send the token
    var _a = req.body, username = _a.username, password = _a.password;
    var user = users.find(function (u) { return u.name === username && u.password === password; });
    console.log('user', user);
    if (!user) {
        res.status(401).send("Unauthorized access");
        return;
    }
    var token = sign({ userId: user.id }, secret_key, { expiresIn: 120 });
    res.status(202).json({ token: token });
});
app.get('/pro', function (req, res) {
    var token = req.headers.authorization;
    if (!token) {
        res.status(400).json({ "message": "token not specified in header" });
        return;
    }
    var auth_token = token.split(' ')[1];
    // console.log(token,'token', auth_token )
    try {
        var decoded_token = verify(auth_token, secret_key);
        var userId_1 = decoded_token.userId;
        var user = users.find(function (u) { return u.id === userId_1; });
        if ((user === null || user === void 0 ? void 0 : user.id) === userId_1) {
            res.status(200).send({ "ID": user === null || user === void 0 ? void 0 : user.id, "Name": user === null || user === void 0 ? void 0 : user.name });
            console.info("Token ".concat(token, " verified: \t"));
            return;
        }
        res.status(401).send({ "message": "Unauthorized user!" });
    }
    catch (err) {
        // console.error('Unauthorized user', err);
        res.status(400).json({ "message": "Invalid token" });
    }
});
app["delete"]('/logout', function (req, res) {
    // expire the token, and redirect to login route
    res.status(204).send();
});
app.get('/', function (req, res) { res.send({ "message": "hello world!" }); });
app.listen(PORT, function () {
    console.log("The server is listening on ".concat(PORT, "."));
});
