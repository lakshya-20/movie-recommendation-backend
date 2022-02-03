var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

//won't be called if session is set to false in redirect url endpoint;
passport.serializeUser((user, done) => {
    //console.log("Serialization called");
    done(null, user);
})

passport.deserializeUser((user, done) => {
    //console.log("Deserialization called");
    done(null, user);
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLECLIENTID,
    clientSecret: process.env.GOOGLECLIENTSECRET,
    callbackURL: process.env.GOOGLECALLBACKURL
    },
    function(accessToken, refreshToken, profile, cb) {
        //console.log("Callback function called");
        return cb(null, profile);
    }
));