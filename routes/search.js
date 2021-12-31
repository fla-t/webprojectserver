var express = require("express");
var router = express.Router();

const _ = require("lodash");
const auth = require("../middleware/auth");

const { User } = require("../models/user");

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/", async (req, res) => {
    try {
        const regex = new RegExp(escapeRegex("Naveed"), "gi");
        let users = await User.find(
            { firstname: regex },
            function (err, usersfound) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(usersfound);
                }
            }
        )
            .clone()
            .catch(function (err) {
                console.log(err);
            });

        // const usersarray = await User.fuzzySearch("naveed");

        // const usersarray = await User.find({
        //     $expr: {
        //         $regexMatch: {
        //             input: { $concat: ["$first", " ", "$last"] },
        //             regex: "req.body.name", //Your text search here
        //             options: "i",
        //         },
        //     },
        // });

        // console.log(usersarray);
        res.status(200).send(usersarray);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

module.exports = router;
