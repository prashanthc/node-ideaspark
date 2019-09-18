const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const User = new Schema({
    email: {
        type: String, 
        required: false,
        trim: true,
        unique: true,
        match:  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    twitterProvider: {
        type: {
            id: String,
            token: String
        }
    }

});

User.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', User);