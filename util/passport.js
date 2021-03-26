var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})

passport.use(new GoogleStrategy({
    clientID: process.env.GoogleClientId,
    clientSecret: process.env.GoogleClientSecret,
    callbackURL: process.env.GoogleCallbackUrl
    },
    function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));