const Joi = require("joi");
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
    },
    text: {
        type: String,
        required: true,
        minLength: 5,
    },
    createdAt: {
        type: Date,
        required: true,
        Default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

const Post = mongoose.model("Post", PostSchema);

function validatePost(post) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(255).required(),
        text: Joi.string().min(5).required(),
    });
    return schema.validate(post);
}

module.exports.Post = Post;
module.exports.PostSchema = PostSchema;
module.exports.validate = validatePost;
