'use strict'

var passport = require('passport'),
    tokenStrategy = require('passport-twitter-token'),
    db = require('./mongoose'),
    config = require('../app.config.js'),
    User = db.User;

module.exports = () => {
    passport.use(new tokenStrategy({
        consumerKey: config.consumerKey,
        consumerSecret: config.consumerSecret,
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