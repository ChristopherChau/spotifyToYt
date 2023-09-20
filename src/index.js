let SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const getMyData = require('../SpotYTFuncs/spotifyPlaylist');
const auth = require('./auth');

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];
const port = process.env.port || 5501;

let spotifyApi = new SpotifyWebApi({
  clientId: 'f0b88a30739c41fba231326afc7d0d15',
  clientSecret: '0d74c82a2ddf411d9feae9b410c772bd',
  redirectUri: `http://localhost:${port}/callback`
});

const app = express();
let accessToken = '';



app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error){
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

spotifyApi.authorizationCodeGrant(code)
  .then(data => {
    accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];
    const expiresIn = data.body['expires_in'];

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    auth.setToken(accessToken);

    console.log(`access token: ${accessToken}\n`);
    console.log(`refresh token: ${refreshToken}\n`);
    console.log(`Expires in ${expiresIn} seconds\n`);
    res.send('Successful');
    
    setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const accessTokenAgain = data.body['access_token'];
        console.log(`Access token refreshed: ${accessTokenAgain}`);
        spotifyApi.setAccessToken(accessTokenAgain);
    }, expiresIn / 2 * 1000);

    getMyData();

  })
  .catch(err => {
      console.error(`Error getting tokens: ${err}`);
      res.send(`Error getting tokens: ${err}\n`);
  });
});


if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}





