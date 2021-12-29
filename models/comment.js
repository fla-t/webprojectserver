const Joi = require("joi");
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Types.Schema.ObjectId,
        required: true,
    },
    text: {
        type: String,
        min: 1,
        max: 255,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        Default: Date.now,
    },
});

const Comment = mongoose.model("Post", PostSchema);

function validateComment(user) {
    const schema = Joi.object({
        post: Joi.objectId().required(),
        text: Joi.string().min(1).max(255).required,
        date: Joi.date(),
    });
    return schema.validate(user);
}

module.exports.Comment = Comment;
module.exports.CommentSchema = CommentSchema;
module.exports.validate = validateComment;
