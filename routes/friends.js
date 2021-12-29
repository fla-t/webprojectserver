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

        friend = await Friend.findOneAndUpdate(
            { user: user._id },
            {
                $addToSet: {
                    friends: userToAdd._id,
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

        let friendExists = await Friend.findOne({ friends: {} });

        friend = await Friend.findOneAndUpdate(
            { user: user._id },
            {
                $pull: {
                    friends: userToAdd._id,
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
