let accessToken = null;

module.exports = {
    setToken: function (token) {
        accessToken = token;
    },
    getToken: function () {
        return accessToken;
    },
};
