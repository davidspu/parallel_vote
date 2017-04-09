var mongoose = require('mongoose');

var models = {
    Votes: mongoose.model('Votes',new mongoose.Schema({
        state : {
            type: String,
            required: true
        },
        session_id : {
          type: String,
          required : true
        }
    })),
    User : mongoose.model('User',new mongoose.Schema({
        username : {
            type : String,
            required: true
        },
        password : {
            type : String,
            required: true
        }
    })),
};

module.exports = models;
