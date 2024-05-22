const express = require('express');
const ExpressError = require('../expressError');

const Message = require("../models/message");
const { ensureLoggedIn } = require('../middleware/auth');

const router = new express.Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const results = await Message.get(req.params.id);
        if (req.body.user === results.from_user.username || req.body.user === results.to_user.username) {
            return res.json({ message: results })
        }
        throw new ExpressError("Unauthorized", 401);
    } catch (err) {
        return next(err)
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const { to_username, body } = req.body;
        if (!to_username || !body) {
            throw new ExpressError('Invalid request', 400);
        }
        const message = await Message.create(req.body.username, to_username, body);
        return res.json({ message });
    } catch (err) {
        return next(err)
    }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensureLoggedIn, async function (req, res, next) {
    try {
        const { username } = req.body;
        const message = await Message.get(req.params.id);
        if (req.body.user !== message.to_user.username) {
            throw new ExpressError(`You're not allowed to mark this message as read.`, 401)
        }
        const result = await Message.markRead(req.params.id)
        return res.json({ message : result });
    } catch (err) {
        return next(err)
    }
});