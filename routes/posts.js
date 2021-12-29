var express = require("express");
var router = express.Router();

const _ = require("lodash");
const auth = require("../middleware/auth");

const { User } = require("../models/user");
const { Post, validate } = require("../models/post");
const { Like } = require("../models/like");

router.post("/", auth, async (req, res) => {
    try {
        const token = req.header("x-auth-token");

        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        req.body.postedBy = req.user._id;

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let post = new Post({
            text: req.body.text,
            images: req.body.images,
            postedBy: req.body.postedBy,
            date: new Date(),
        });

        let like = new Like({
            post: post.id,
            likedBy: [],
        });

        like.save();

        post = await post.save();
        res.send(post);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.get("/:id", auth, async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send("Can't find Post!");

        res.send(post);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const token = req.header("x-auth-token");

        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let post = await Post.findById(req.params.id);
        if (!post) return res.status(400).send("Post not found!");

        if (post.postedBy.toString() !== user.id)
            return res
                .status(400)
                .send("You don't have permission to do that.");

        post = await Post.findOneAndUpdate(
            { id: post.id },
            {
                $set: {
                    text: req.body.text,
                    images: req.body.images,
                    postedBy: req.body.postedBy,
                    date: new Date(),
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

        let post = await Post.findById(req.body._id);
        if (!post) return res.status(400).send("Post not found!");

        if (post.createdBy.toString() !== user.id)
            return res
                .status(400)
                .send("You don't have permission to do that.");

        post = await Post.findOneAndDelete({ id: post.id });

        res.status(200).send();
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

module.exports = router;
