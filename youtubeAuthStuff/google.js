const passport = require("passport");
const Strategy = require("passport-google-oauth20").Strategy;
const VerifyCallback = require("passport-google-oauth20").VerifyCallback;
const Profile = require("passport-google-oauth20").Profile;
const ytAuth = require("./setToken");

passport.use(
    new Strategy(
        {
            clientID:
                "36943627344-9nvmr1ssaln2b61evcgjrujgstd81vav.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:5502/api/auth/google/redirect",
            scope: [
                "email",
                "profile",
                "https://www.googleapis.com/auth/youtube",
                "https://www.googleapis.com/auth/youtube.force-ssl",
            ],
            //VARIABLES ABOVE MUST BE SET LIKE THAT BECAUSE IT IS PART OF STRATEGY CONSTRUCTOR
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(accessToken);
            await ytAuth.setYoutubeToken(accessToken);
            console.log(ytAuth.getYoutubeToken());
            done(null, profile);
        }
    )
);
