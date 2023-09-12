const fs = require('fs');
const SpotifyWebApi = require('spotify-web-api-node');
// const { accessToken } = require('./src/index');

// console.log(accessToken);

const token = 'BQAi8tNHJb7nLb8c1jdPgIqcjmgx_o9uDtrZNw4fMMCfDbpit-RY7VYn9zHApfPygozTLJv47y39fUzqtgNOcEnkm6_x8ejcKwwmK2DTMIJ1NvJU9rKzyswDzU8XdJgG57JVTbdkCLBPdT9G8dLEj3xfNqv1FUZU3umP_TvJedLMprogWvwrW4xSoSNM6u6PstrKItVKFls_jtxeMCL0G8Ibh9KE_PEjqJugppfeFjPoRLRsU2KmqPRTCQFoLJx-lsRthfL7ip7evZjD-_I_4e_p7dXsJ2FLbp0Yxfm9uN7dwqPpY6gFvvN1V4lYQOOn2iexM5ydW-yU5B--mfiV';

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

function getMyData(){
  (async () => {
    const me = await spotifyApi.getMe();
    getUserPlaylists(me.body.id);
  })
  ().catch(err => {
    console.error(err);
  });
}

async function getUserPlaylists(user){
  const data = await spotifyApi.getUserPlaylists(user);


  for (let playlist of data.body.items){
    console.log('\n\n\n' + playlist.name + " " + playlist.id);
    
    let tracks = await getPlayListsTracks(playlist.id, playlist.name);

  }
}

async function getPlayListsTracks(playlistID, playlistName){
  const data = await spotifyApi.getPlaylistTracks(playlistID, {
    offset: 1,
    limit: 100,
    fields: 'items' //specifies the field to include in the response (only looking for items field which contains the array's track objs)
  })

  let tracks = [];

  for (let trackObj of data.body.items){
    const track = trackObj.track;
    tracks.push(track);
    let artist = track.artists[0].name;
    let songName = track.name;
    console.log(`${songName} ${artist}`);

    //from this point on we just have to interact with the youtube api and then just search the artist and the name and then add to playlist


  }

  return tracks;
}

module.exports = getMyData;
