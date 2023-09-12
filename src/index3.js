const express = require('express');
const path = require('path');

const REDIRECT_URI = 'http://127.0.0.1:5500/SpotifyYoutube/index.html';
const AUTHORIZE = 'https://accounts.spotify.com/authorize';

let client_id = '';
let client_secret = '';


const PORT = process.env.PORT || 5502;
const app = express();


app.get('/authorize', requestAuthorization); //will have to make the submit button update the current url to the route /authorize which will then call request authorization


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// Part 1: GETTING AUTHORIZATION


function onPageLoad () {
client_id = localStorage.getItem('client_id');
client_secret = localStorage.getItem('client_secret');

}

function requestAuthorization(req, res){
  client_id = req.body.client_id; //maybe just body?
  client_secret = req.body.client_secret;

  if (!client_id || !client_secret){
    return res.status(400).send('Both client id and secret are required');
  }
  let url = AUTHORIZE + '/authorize';

    url += '?client_id=' + client_id;
    url += '&response_type=code';
    url += '&redirect_uri=' + encodeURI(REDIRECT_URI);
    url += '&show_dialog=true';
    url += '&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private';

  // Redirect the user to the Spotify authorization URL
  res.redirect(url);
}






app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

console.log('hi');