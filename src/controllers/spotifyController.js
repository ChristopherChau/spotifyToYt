const spotifyApi = require("../config/spotifyConfig");
const tokenHandler = require("../middlewares/tokenHandler")

async function handleSpotifyCallback(req, res) {
    const { code, error } = req.query;
    if (error) {
        console.error("Callback Error:", error);
        return res.status(500).send(`Callback Error: ${error}`);
    }

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        // setToken(data.body["access_token"]);
        tokenHandler.setToken("spotify", data.body["access_token"]);
        spotifyApi.setAccessToken(data.body["access_token"]);
        spotifyApi.setRefreshToken(data.body["refresh_token"]);
        res.send("Successful Spotify Authentication");
    } catch (err) {
        console.error("Error getting tokens:", err);
        res.status(500).send(`Error getting tokens: ${err}`);
    }
}

module.exports = {
    handleSpotifyCallback,
};
