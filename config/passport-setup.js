const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID:     keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "http://localhost:3000/auth/redirect",
    accessType: 'offline'
  }, (accessToken, refreshToken, profile, done) => {
    //check if user already exists in our db 
    User.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser) {
            //already have the user
            console.log('user is:', currentUser);
            done(null, currentUser);
        } else {
            //if not, create uer in our db
            new User({
                username: profile.displayName,
                googleId: profile.id
            }).save().then((newUser) => {
                console.log('new user created:' + newUser);
                done(null, newUser);
            });
        }
    });
}
));