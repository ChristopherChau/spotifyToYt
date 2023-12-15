let accessToken = "";

function setToken(token) {
    accessToken = token;
}

function getToken() {
    return accessToken;
}

module.exports = {
    setToken,
    getToken,
};
