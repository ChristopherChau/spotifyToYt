let SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')


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

const spotifyApi = new SpotifyWebApi({
  client_id: 'f0b88a30739c41fba231326afc7d0d15',
  client_secret: '0d74c82a2ddf411d9feae9b410c772bd',
  redirect_uri: 'http://127.0.0.1:5501/SpotifyYoutube/index.html'
});

// http://localhost:5507/login

const app = express();
const port = process.env.port || 5520;

app.use(express.static('public'));

app.get('/', (req,res) => {
  res.send('<h1>hello worlds</h1>');
});


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
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];
    const expiresIn = data.body['expires_in'];

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    console.log(`access token: ${accessToken}`);
    console.log(`refresh token: ${refreshToken}`);
    console.log(`Expires in ${expiresIn} seconds`);
    res.send('Successful');
    
    setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const accessTokenAgain = data.body['access_token'];
        console.log('Access token refreshed');
        spotifyApi.setAccessToken(accessTokenAgain);
    }, expiresIn / 2 * 1000);
  })
  .catch(err => {
      console.error(`Error getting tokens: ${err}`);
      res.send(`Error getting tokens: ${err}`);
  });

});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

console.log('port');