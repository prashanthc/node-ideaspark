var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var profileRoutes = require('./routes/profile-routes');
var authRoutes = require('./routes/auth-routes');
var cookieSession = require('cookie-session');
var passportConfig = require('./db/passport');
var config = require('./config/app.config');
var passport = require('passport');

passportConfig();

var app = express();

var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));
app.use(bodyParser.json());

app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [config.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/api/v1', authRoutes);
app.use('/profile', profileRoutes);

app.use(express.static(__dirname + '/dist'));

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});


var port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;