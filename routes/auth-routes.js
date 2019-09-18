var router = require('express').Router();
var request = require('request');
var config = require('../config/app.config');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var mongoose = require('../db/mongoose');
var User = mongoose.User;

router.route('/health-check').get(function (req, res) {
    res.status(200);
    res.send('Hello World');
});

var createToken = function (auth) {
    return jwt.sign({
        id: auth.id
    }, 'my-secret',
        {
            expiresIn: 60 * 120
        });
};

// var generateToken = function (req, res, next) {
//     req.token = createToken(req.auth);
//     return next();
// };

// var sendToken = function (req, res) {
//     res.setHeader('x-auth-token', req.token);
//     req.user.token = req.token;
//     req.get({url: 'http://localhost:8080/home', headers: req.headers});
// };

router.route('/auth/twitter/reverse')
    .post(function (req, res) {
        request.post({
            url: 'https://api.twitter.com/oauth/request_token',
            oauth: {
                oauth_callback: "http%3A%2F%2Flocalhost%3A8080%2Ftwitter-callback",
                consumer_key: config.twitter.consumerKey,
                consumer_secret: config.twitter.consumerSecret
            }
        }, function (err, r, body) {
            if (err) {
                return res.send(500, { message: e.message });
            }

            var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            res.send(JSON.parse(jsonStr));
        });
    });

router.route('/auth/twitter')
    .get((req, res, next) => {
        request.post({
            url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
            oauth: {
                consumer_key: config.consumerKey,
                consumer_secret: config.consumerSecret,
                token: req.query.oauth_token
            },
            form: { oauth_verifier: req.query.oauth_verifier }
        }, function (err, r, body) {
            if (err) {
                return res.send(500, { message: err.message });
            }

            const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            const parsedBody = JSON.parse(bodyString);
            req.body = {};
            req.body['oauth_token'] = parsedBody.oauth_token;
            req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
            req.body['user_id'] = parsedBody.user_id;

            next();
        });
    }, passport.authenticate('twitter-token', { session: false }), function (req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }

        // prepare token for API
        req.auth = {
            id: req.user.id
        };
        
        return res.redirect('/profile/');
    });

var authenticate = expressJwt({
    secret: 'my-secret',
    requestProperty: 'auth',
    getToken: function (req) {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }
        return null;
    }
});

var getCurrentUser = function (req, res, next) {
    User.findById(req.auth.id, function (err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

var getOne = function (req, res) {
    var user = req.user.toObject();

    delete user['twitterProvider'];
    delete user['__v'];

    res.json(user);
};

router.route('/auth/me')
    .get(authenticate, getCurrentUser, getOne);


module.exports = router;