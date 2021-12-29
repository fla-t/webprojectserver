const Joi = require("joi");
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        min: 0,
        max: 255,
    },
    images: {
        type: [String],
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
        Default: Date.now,
    },
});

const Post = mongoose.model("Post", PostSchema);

function validatePost(user) {
    const schema = Joi.object({
        text: Joi.string().min(0).max(255),
        images: Joi.array().items(Joi.string()).min(0),
        postedBy: Joi.objectId().required(),
        date: Joi.date(),
    });
    return schema.validate(user);
}

module.exports.Post = Post;
module.exports.PostSchema = PostSchema;
module.exports.validate = validatePost;
