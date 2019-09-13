//https://medium.com/@robince885/how-to-do-twitter-authentication-with-react-and-restful-api-e525f30c62bb
const express = require('express');
const Twitter = require('twit');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const config = require('./config.json');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => console.log(`Server Running on ${port}...`));

const api_client = new Twitter({
    consumer_key: config.CONSUMER_KEY,
    consumer_secret: config.CONSUMER_SECRET,
    access_token: config.ACCESS_TOKEN,
    access_token_secret: config.ACCESS_TOKEN_SECRET
});

app.get('/home_timeline', (req, res) => {
    const params = { tweet_mode: 'extended', count: 10 };
    api_client
        .get(`statuses/home_timeline`, params)
        .then(timeline => {

            res.send(timeline);
        })
        .catch(error => {
            res.send(error);
    });
});
