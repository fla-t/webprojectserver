const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    lastname: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    dob: {
        type: Date,
        required: true,
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
    avatar: {
        type: String,
        required: false,
        Default: null,
    },
    bio: {
        type: String,
        required: false,
        Default: null,
    },
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

// userSchema.plugin(mongoose_fuzzy_searching, {
//     fields: ["firstName", "lastName"],
// });

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstname: Joi.string().min(5).max(50).required(),
        lastname: Joi.string().min(5).max(50).required(),
        dob: Joi.date().required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        bio: Joi.string().min(0).max(255),
        // avatar: Joi.string().required(),
    });
    return schema.validate(user);
}

function validateUserExceptPassword(user) {
    const schema = Joi.object({
        firstname: Joi.string().min(5).max(50).required(),
        lastname: Joi.string().min(5).max(50).required(),
        dob: Joi.date().required(),
        email: Joi.string().min(5).max(255).required().email(),
        bio: Joi.string().min(0).max(255),
        // avatar: Joi.string().required(),
    });
    return schema.validate(user);
}

function validateUserCreds(user) {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
    });
    return schema.validate(user);
}

module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validate = validateUser;
module.exports.validateCreds = validateUserCreds;
module.exports.validateExceptPassword = validateUserExceptPassword;
