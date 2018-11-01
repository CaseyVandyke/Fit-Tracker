'use strict';

const mongoose = require('mongoose');
const User = require('./users-model');
mongoose.Promise = global.Promise;



const dietSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title field is required']
    },
    calories: {
        type: Number,
        required: [true, 'calorie field is required']
    },
    img: {
        type: String,
        required: false
    },
    recipe: [String],
    notes: {
        type: String,
        required: [true, 'notes field is required']
    },
    author: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'users'
    }
    
});

const Diet = mongoose.model('diets', dietSchema);




module.exports =  Diet;