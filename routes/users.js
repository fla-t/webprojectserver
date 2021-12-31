var express = require("express");
var router = express.Router();

const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer")(
    "../public/uploads/profile_pictures/"
);

const { Friend } = require("../models/friend");
const {
    User,
    validate,
    validateCreds,
    validateExceptPassword,
} = require("../models/user");

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
                "avatar",
                "bio",
            ])
        );

        let friend = new Friend({
            user: user.id,
            friends: [],
            pending: [],
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
            user: _.pick(user, [
                "id",
                "firstname",
                "lastname",
                "email",
                "dob",
                "avatar",
                "bio",
            ]),
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
        user = _.pick(user, [
            "id",
            "firstname",
            "lastname",
            "email",
            "dob",
            "avatar",
            "bio",
        ]);
        res.send(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.put("/edit", [auth, upload.single("avatar")], async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        const { error } = validateExceptPassword(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        if (req.file) {
            if (user.avatar) {
                fs.unlinkSync(
                    path.join(
                        __dirname,
                        "../public/uploads/profile_pictures/" + user.avatar
                    )
                );
            }
        }

        user = await User.findByIdAndUpdate(
            user.id,
            {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    dob: req.body.dob,
                    email: req.body.email,
                    bio: req.body.bio,
                    avatar: req.file ? req.file.filename : user.avatar,
                },
            },
            { new: true }
        );

        res.send(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

module.exports = router;
