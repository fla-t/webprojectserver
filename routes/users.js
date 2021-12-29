var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const { User, validate, validateCreds } = require("../models/user");

router.post("/signup", async (req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Exists!");

    user = new User(
        _.pick(req.body, ["firstname", "lastname", "dob", "password", "email"])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = { token: user.generateAuthToken() };
    res.send(token);
});

router.post("/signin", async (req, res, next) => {
    const { error } = validateCreds(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User Already Exists");

    validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).send("Invalid email or password");

    const token = {
        token: user.generateAuthToken(),
        user: _.pick(user, ["firstname", "lastname", "email", "dob"]),
    };
    res.send(token);
});

module.exports = router;
