const axios = require("axios");
const SpotifyWebApi = require("spotify-web-api-node");
const auth = require("../src/auth");
const downloadVideo = require("./download");
const searchOnYoutube = require("./youtube");
const spotifyData = require("../setSpotify");
const { setPlaylistAndTracks } = require("../setPlaylistInfo");

let token = "";
let dictionary = {};

const spotifyApi = new SpotifyWebApi();

async function setTokenData() {
    token = auth.getToken();
    spotifyApi.setAccessToken(token);
}

async function getMyData() {
    (async () => {
        setTokenData();
        const me = await spotifyApi.getMe();
        getUserPlaylists(me.body.id);
        console.log("getting user data");
    })().catch((err) => {
        console.error(err);
    });
}

async function getUserPlaylists(user) {
    const data = await spotifyApi.getUserPlaylists(user);
    let playlists = [];

    // For multiple playlist
    for (let playlist of data.body.items) {
        if (playlist.name === "Kp") {
            playlists.push(playlist.name);
            let tracks = await getPlayListsTracks(playlist.id, playlist.name);
        }
    }
}

async function getPlayListsTracks(playlistID, playlistName) {
    const data = await spotifyApi.getPlaylistTracks(playlistID, {
        offset: 0,
        limit: 100,
        fields: "items",
    });
    spotifyData.setData(data); //find out what this data is and why we are setting it to use it for later
    console.log(data);

    let tracks = [];
    let count = 0;
    for (let trackObj of data.body.items) {
        if (count  === 5){
            console.log("reaching 5 count limit");
            break;
        }
        const track = trackObj.track;
        tracks.push(track);
        let artist = track.artists[0].name;
        let songName = track.name;
        setPlaylistAndTracks(playlistName, `${songName} ${artist}`);
        count += 1;
        // we're able to get all the songs and the artists to use globally
    }

    return tracks;
}

module.exports = getMyData;
// module.exports = getPlayListsTracks;
