const fs = require("fs");
const { url } = require("inspector");
const SpotifyWebApi = require("spotify-web-api-node");
const auth = require("../src/auth");
const downloadVideo = require("./download");
const searchOnYoutube = require("./youtube");

let token = "";

const spotifyApi = new SpotifyWebApi();

async function setTokenData() {
    token = auth.getToken();
    spotifyApi.setAccessToken(token);
}

async function getMyData() {
    (async () => {
        setTokenData();
        // const me = await spotifyApi.getMe();
        // getUserPlaylists(me.body.id);
        console.log("getting user data");
    })().catch((err) => {
        console.error(err);
    });
}

async function getUserPlaylists(user) {
    const data = await spotifyApi.getUserPlaylists(user);
    let playlists = [];

    // For multiple playlist
    // for (let playlist of data.body.items){
    //   if(playlist.name === 'rondom' || playlist.name === 'Kp') {
    //     playlists.push(playlist.name);
    //     let tracks = await getPlayListsTracks(playlist.id, playlist.name);
    //   }
    // }

    // let tracks = await getPlayListsTracks(playlist.id, playlist.name);
    // const tracksJSON = {tracks};
    // let JSONdata = JSON.stringify(tracksJSON);
    // fs.writeFileSync(`${playlist.name} .json ${data}`);
    // }

    // One Playlist
    let playlist = data.body.items[0];
    console.log("\n\n\n" + playlist.name + " " + playlist.id);
    let tracks = await getPlayListsTracks(playlist.id, playlist.name);
    //create yt playlist here?
}

async function getPlayListsTracks(playlistID, playlistName) {
    const data = await spotifyApi.getPlaylistTracks(playlistID, {
        offset: 1,
        limit: 100,
        fields: "items", //specifies the field to include in the response (only looking for items field which contains the array's track objs)
    });

    let tracks = [];
    // let count = 0;
    // for (let trackObj of data.body.items){
    //   const track = trackObj.track;
    //   tracks.push(track);
    //   let artist = track.artists[0].name;
    //   let songName = track.name;
    //   let songInfo = await searchOnYoutube(songName, artist); //this returns video id and video url so then we can just get both in two diff variables
    //   let path = `./${playlistName}`;
    //   downloadVideo(path, songName, songInfo.videoUrl);
    // }

    // This will print out only one song in the first playlist
    let item = data.body.items[0];
    const track = item.track;
    let artist = track.artists[0].name;
    let songName = track.name;
    let songInfo = await searchOnYoutube(songName, artist);

    console.log(songInfo.videoUrl);

    return tracks;
}

module.exports = getMyData;
