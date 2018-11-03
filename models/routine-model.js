'use strict'

const mongoose = require('mongoose');
const User = require('./users-model');
mongoose.Promise = global.Promise;

const commentSchema = mongoose.Schema({
    comment: String
});
//Creat routine Schema and model

const routineSchema = mongoose.Schema({
    targetMuscle: {
        type: String,
        required: [true, 'Target muscle field is required']
    },
    workout: {
        type: String,
        required: [true, 'Workout field is required']
    },
    sets: {
        type: String,
        required: [true, 'Sets field is required']
    },
    reps: {
        type: String,
        required: [true, 'Repetitions field is required']
    },
    img: String,
    author: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'users'
    }

});

const Routine = mongoose.model('routines', routineSchema);

module.exports = Routine;