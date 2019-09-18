'use strict'

var passport = require('passport'),
    tokenStrategy = require('passport-twitter-token'),
    db = require('./mongoose'),
    config = require('../config/app.config'),
    User = db.User;

module.exports = () => {

    passport.serializeUser((user, done)=>{
        done(null, user.twitterProvider.id);
    });

    passport.deserializeUser((id, done)=>{
        User.findOne({ 'twitterProvider.id': id}).then((user)=>{
            done(null, user);
        });
    });

    passport.use(new tokenStrategy({
        consumerKey: config.twitter.consumerKey,
        consumerSecret: config.twitter.consumerSecret,
        includeEmail: true
    },
        (token, tokenSecret, profile, done) => {
            User.findOne({ 'twitterProvider.id': profile.id }, (err, user) => {
                if (user) {
                    return done(err, user);
                }

                var newUser = new User({
                    email: profile.emails[0].value,
                    twitterProvider: {
                        id: profile.id,
                        token: token,
                        tokenSecret: tokenSecret
                    }
                });

                newUser.save((err, savedUser) => {
                    if (err) {
                        console.log(err);
                    }

                    return done(err, savedUser);
                });
            });

        }));
};