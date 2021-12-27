const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
    },
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}

function validateUserCreds(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}

module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validate = validateUser;
module.exports.validateCreds = validateUserCreds;
