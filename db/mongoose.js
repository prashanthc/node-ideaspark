const config = require('../app.config.js');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('Connection to DB Successful...'));
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../model/user.model')
};