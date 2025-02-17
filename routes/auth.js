const jwt = require("jsonwebtoken");
const express = require("express");
const db = require("../db");
const ExpressError = require("../expressError")
const BCRYPT_WORK_FACTOR = require("../config");
const { User } = require("../models/user");
const { SECRET_KEY } = require("../config")



let router = new express.Router();


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function (req, res, next) {
    try {
        let { username, password } = req.body;
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({ username }, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({ token })
        }
        throw new ExpressError("Invalid credentials", 400)
    } catch (err) {
        return next(err)
    }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async function (req, res, next) {
    try {
        let { username } = await User.register(req.body);
        let token = jwt.sign({ username }, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({ token });

    } catch (err) {
        return next(err)
    }
});