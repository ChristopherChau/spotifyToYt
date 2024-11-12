const express = require("express");
const { handleSpotifyCallback } = require("../controllers/spotifyController");

const router = express.Router();

router.get("/spotify/callback", handleSpotifyCallback);
module.exports = router;
