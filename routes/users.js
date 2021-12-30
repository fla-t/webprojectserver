var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

const { Friend } = require("../models/friend");
const { User, validate, validateCreds } = require("../models/user");

router.post("/signup", async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User Already Exists!");

        user = new User(
            _.pick(req.body, [
                "firstname",
                "lastname",
                "dob",
                "password",
                "email",
            ])
        );

        let friend = new Friend({
            user: user.id,
            friends: [],
        });

        friend.save();

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = { token: user.generateAuthToken() };
        res.send(token);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.post("/signin", async (req, res, next) => {
    try {
        const { error } = validateCreds(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("User Doesn't Exists");

        validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(400).send("Invalid email or password");

        const token = {
            token: user.generateAuthToken(),
            user: _.pick(user, ["id", "firstname", "lastname", "email", "dob"]),
        };
        res.send(token);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("User Doesn't Exists");
        user = _.pick(user, ["id", "firstname", "lastname", "email", "dob"]);
        res.send(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.put("/edit", auth, async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        user = await User.findOneAndUpdate(
            { id: user._id },
            {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    dob: req.body.dob,
                    email: req.body.email,
                    password: req.body.password,
                },
            }
        );

		res.send(post);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

module.exports = router;
