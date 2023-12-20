// // let accessToken =
// //     "ya29.a0AfB_byBjNEDvF5K3rMx2VRd6sOdy-Pb_cIHGSx4jMfRFQgeYuo2hM5MS_yxzYygamxqkShPVsG-IODUuSw4LNXMbvCviEomUmGFSkxJCeQ_wPF7C9ieEVlYbAD37MyU-mZLKI1ZWeZgj1KcjezEbvL7-Otjmtprdd2bvaCgYKAeISARMSFQHGX2MiIiq5v3fnXd4WgxuvIiuy9Q0171";

// function setYoutubeToken(token) {
//     accessToken = token;
// }

// function getYoutubeToken() {
//     return accessToken;
// }

// module.exports = {
//     setYoutubeToken,
//     getYoutubeToken,
// };

let accessToken = null;

module.exports = {
    setToken: function (token) {
        accessToken = token;
    },
    getToken: function () {
        return accessToken;
    },
};
