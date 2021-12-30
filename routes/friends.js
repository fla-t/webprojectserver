var express = require("express");
var router = express.Router();

const _ = require("lodash");
const auth = require("../middleware/auth");

const { User } = require("../models/user");
const { Friend } = require("../models/friend");

router.get("/add/:id", auth, async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        let friend = await Friend.findOne({ user: user._id });
        if (!friend) return res.status(400).send("User not found!");

        let userToAdd = await User.findById(req.params.id);
        if (!userToAdd) return res.status(400).send("Can't find User!");

        await Friend.findOneAndUpdate(
            { user: user._id },
            {
                $addToSet: {
                    friends: userToAdd._id,
                },
            }
        );

        await Friend.findOneAndUpdate(
            { user: userToAdd._id },
            {
                $addToSet: {
                    friends: user._id,
                },
            }
        );

        res.status(200).send();
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.get("/remove/:id", auth, async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        let friend = await Friend.findOne({ user: user._id });
        if (!friend) return res.status(400).send("User not found!");

        let userToRemove = await User.findById(req.params.id);
        if (!userToRemove) return res.status(400).send("Can't find User!");

        await Friend.findOneAndUpdate(
            { user: user._id },
            {
                $pull: {
                    friends: userToRemove._id,
                },
            }
        );

        await Friend.findOneAndUpdate(
            { user: userToRemove._id },
            {
                $pull: {
                    friends: user._id,
                },
            }
        );

        res.status(200).send();
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

module.exports = router;
