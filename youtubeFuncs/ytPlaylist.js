const ytAuth = require('../youtubeAuthStuff/setToken');

async function main() {
  const youtubeToken = await ytAuth.getYoutubeToken();
  console.log(youtubeToken);
}

main();

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
