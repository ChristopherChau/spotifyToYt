// src/auth/tokenHandler.js

const tokens = {
    youtube: "",
    spotify: ""
};

function setToken(service, token) {
    tokens[service] = token;
}

function getToken(service) {
    return tokens[service];
}

module.exports = { setToken, getToken };
