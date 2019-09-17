const config = require('../app.config.js');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connection to DB Successful...'));
mongoose.connection.on('error', (error) => {
    console.log('Db Connection error:', error);
});

mongoose.connection.once('open', function () {
    console.log('Database connected');
});
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../model/user.model')
};