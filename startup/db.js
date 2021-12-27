const mongoose = require("mongoose");

module.exports = function () {
    mongoose
        .connect("mongodb://localhost:27017/assignment5")
        .then(() => console.info("connected to mongoDB"));
};
