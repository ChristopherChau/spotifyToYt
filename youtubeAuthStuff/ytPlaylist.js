const ytAuth = require('./setToken');


  const youtubeToken = ytAuth.getYoutubeToken();
  console.log(ytAuth.getYoutubeToken());




async function createYTPlaylist(playlistName){

}


async function addToPlaylist(playlistName, urlToSong){

}


// const url = 'https://www.googleapis.com/youtube/v3/playlists';


// let token = ytAuth.getYoutubeToken();
// console.log(token);

// const config = {
//   method: 'POST',
//   headers:{
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${ytAuth.getYoutubeToken}`,
//   },
// };


// //http://localhost:5502/api/auth/google
// node youtubeFuncs/ytPlaylist
// node youtubeAuthStuff/youtubeOauth