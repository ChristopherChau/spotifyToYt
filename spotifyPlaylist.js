const fs = require('fs');
const { url } = require('inspector');
const SpotifyWebApi = require('spotify-web-api-node');
const auth = require('./src/auth');
const searchOnYoutube = require('./youtubeFuncs/youtube');


let token = '';

const spotifyApi = new SpotifyWebApi();

async function setTokenData(){
  token = auth.getToken();
  spotifyApi.setAccessToken(token);
}

async function getMyData(){
  (async () => {
    setTokenData();
    const me = await spotifyApi.getMe();
    getUserPlaylists(me.body.id);
  })
  ().catch(err => {
    console.error(err);
  });
}

async function getUserPlaylists(user){
  const data = await spotifyApi.getUserPlaylists(user);
  let playlists = [];

  // for (let playlist of data.body.items){
  //   console.log('\n\n\n' + playlist.name + " " + playlist.id);
    
  //   let tracks = await getPlayListsTracks(playlist.id, playlist.name);
        // const tracksJSON = {tracks};
        // // let JSONdata = JSON.stringify(tracksJSON);
        // // fs.writeFileSync(`${playlist.name} .json ${data}`);
  // }

  let playlist = data.body.items[0];
  console.log('\n\n\n' + playlist.name + " " + playlist.id);
  let tracks = await getPlayListsTracks(playlist.id, playlist.name);
}

async function getPlayListsTracks(playlistID, playlistName){
  const data = await spotifyApi.getPlaylistTracks(playlistID, {
    offset: 1,
    limit: 100,
    fields: 'items' //specifies the field to include in the response (only looking for items field which contains the array's track objs)
  })

  let tracks = [];

  // for (let trackObj of data.body.items){
  //   const track = trackObj.track;
  //   tracks.push(track);
  //   let artist = track.artists[0].name;
  //   let songName = track.name;

  //   searchOnYoutube(songName, artist); this returns video id and video url so then we can just get both in two diff variables


  //   //from this point on we just have to interact with the youtube api and then just search the artist and the name and then add to playlist


  // }
  let item = data.body.items[0]; // Assuming data.body.items[0] is an array of objects
  const track = item.track;
  let artist = track.artists[0].name;
  let songName = track.name;
  searchOnYoutube(songName, artist);
  

  return tracks;
}

module.exports = getMyData;