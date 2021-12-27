var express = require("express");
const { result } = require("lodash");
var router = express.Router();

const auth = require("../middleware/auth");
const { Post, validate } = require("../models/post");
const { User } = require("../models/user");
const _ = require("lodash");

router.get("/", async (req, res, next) => {
    try {
        const posts = await Post.find({}).sort("-createdAt");
        // add pagination code
        res.send(posts);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);
        res.send(post);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.post("/", auth, async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");

        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let post = new Post({
            title: req.body.title,
            text: req.body.text,
            createdBy: user.id,
            createdAt: new Date(),
        });

        post = await post.save();
        res.send(post);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.put("/", auth, async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");

        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        const { error } = validate(_.pick(req.body, ["title", "text"]));
        if (error) return res.status(400).send(error.details[0].message);

        let post = await Post.findById(req.body._id);
        if (!post) return res.status(400).send("Post not found!");

        if (post.createdBy.toString() !== user.id)
            return res
                .status(400)
                .send("You don't have permission to do that.");

        post = await Post.findOneAndUpdate(
            { id: post.id },
            {
                $set: {
                    title: req.body.title,
                    text: req.body.text,
                    createdAt: new Date(),
                },
            }
        );

        res.send(post);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.delete("/", auth, async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");

        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        const { error } = validate(_.pick(req.body, ["title", "text"]));
        if (error) return res.status(400).send(error.details[0].message);

        let post = await Post.findById(req.body._id);
        if (!post) return res.status(400).send("Post not found!");

        if (post.createdBy.toString() !== user.id)
            return res
                .status(400)
                .send("You don't have permission to do that.");

        post = await Post.findOneAndDelete(
            { id: post.id },
            {
                $set: {
                    title: req.body.title,
                    text: req.body.text,
                    createdAt: new Date(),
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
