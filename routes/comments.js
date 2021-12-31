var express = require("express");
var router = express.Router();

const _ = require("lodash");
const auth = require("../middleware/auth");

const { User } = require("../models/user");
const { Post } = require("../models/post");
const { Comment, validate } = require("../models/comment");

router.post("/", auth, async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        req.body.postedBy = req.user._id;

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let post = await Post.findById(req.body.post);
        if (!post) return res.status(400).send("Post not found!");

        let comment = new Comment({
            post: post._id,
            text: req.body.text,
            postedBy: req.body.postedBy,
            date: new Date(),
        });

        comment.save();

        res.status(200).send();
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        req.body.postedBy = req.user._id;

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(400).send("Comment not found!");

        if (comment.postedBy.toString() !== user.id)
            return res
                .status(400)
                .send("You don't have permission to do that.");

        comment = await Comment.findByAndUpdate(
            comment.id,
            {
                $set: {
                    text: req.body.text,
                    post: req.body.post,
                    postedBy: req.body.postedBy,
                    date: new Date(),
                },
            },
            { new: true }
        );

        res.send(comment);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("Can't find User!");

        let comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(400).send("Post not found!");

        if (comment.postedBy.toString() !== user.id)
            return res
                .status(400)
                .send("You don't have permission to do that.");

        comment = await Comment.findByIdAndDelete(comment.id);

        res.status(200).send();
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

module.exports = router;
