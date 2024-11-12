const spotifyApi = require("../config/spotifyConfig");

async function getUserPlaylists() {
    const playlists = await spotifyApi.getUserPlaylists();
    return playlists.body.items;
}

module.exports = { getUserPlaylists };
