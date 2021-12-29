const Joi = require("joi");
const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.Schema.ObjectId,
        required: true,
    },
    friends: {
        type: [mongoose.Types.Schema.ObjectId],
        required: true,
    },
});

const Friend = mongoose.model("Friend", PostSchema);

module.exports.Friend = Friend;
module.exports.FriendSchema = FriendSchema;
