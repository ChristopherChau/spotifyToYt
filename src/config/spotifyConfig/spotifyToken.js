let accessToken = "";

function spotifySetToken(token) {
    accessToken = token;
}

function spotifyGetToken() {
    return accessToken;
}

module.exports = {
    spotifySetToken,
    spotifyGetToken,
};
