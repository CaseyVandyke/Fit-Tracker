'use strict'

const express = require('express');
const router = express.Router();
const Routine = require('../models/routine-model')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/users-model');

const jwtAuth = passport.authenticate('jwt', { session: false });

/*
router.get('/routines/:id', jwtAuth, (req, res, next) => {
  Routine.find({
      '_id': req.params.id
  }, (err, routine) => {
      if (err) {
          console.error(err)
          res.status(500).json({
              error: 'something went wrong'
          });
      } else {
          res.send(routine)
      }
  })
});
*/

//Get all routines from the database
router.get('/routines', jwtAuth, (req,res, next) => {
  console.log(req.user.username);
  Routine.find({"author": req.user.username})
  .then((routine) => {
    res.send(routine);
  })
  .catch(function(err){
    console.error(err);
    res.status(500).json({
      error: 'something went wrong'
    });
  })
});

// Add a new routine in the databse
router.post('/routines', jwtAuth, (req,res, next) => {
  console.log(req.body);
  Routine.create(req.body)
  .then((routine) => {
    res.send(routine);
  }).catch(next)
});
/* Update a routine in the databse
router.put('/routines/:id', jwtAuth, (req,res, next) => {
  Routine.findByIdAndUpdate({_id: req.params.id}, req.body)
  .then(function(){
    Routine.findOne({_id: req.params.id}).then((routine) => {
      res.send(routine);
    });
  });
});
*/

//Delete a routine from the database
router.delete('/routines/:id', jwtAuth, (req,res, next) => {
  Routine.findByIdAndRemove({_id: req.params.id})
  .then((routine) => {
    res.send(routine);
  });
});

module.exports = { router };