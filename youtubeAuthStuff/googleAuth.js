const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/google", passport.authenticate("google"), (req, res) =>
    res.sendStatus(200)
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) =>
    res.sendStatus(200)
);

module.exports = router;

//this is the file that leads users to the authentication page where they can log in by google
