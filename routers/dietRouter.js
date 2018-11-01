const express = require('express');
const router = express.Router();
const passport = require('passport');
const Diet = require('../models/diets-model');
const User = require('../models/users-model');
const jwt = require('jsonwebtoken');

const jwtAuth = passport.authenticate('jwt', { session: false });
/*
router.get('/diets/:id', jwtAuth, (req, res, next) => {
    Diet.find({
        '_id': req.params.id
    }, (err, diet) => {
        if (err) {
            console.error(err)
            res.status(500).json({
                error: 'something went wrong'
            });
        } else {
            res.send(diet)
        }
    })
});
*/
router.get('/diets', jwtAuth, (req, res, next) => {
    Diet.find({"author": req.user.username})
        .then((diet) => {
            res.send(diet);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({
                error: 'something went wrong'
            });
        });
});

router.post('/diets', jwtAuth, (req, res, next) => {
    console.log(req.body);
  Diet.create(req.body)
  .then((diet) => {
    res.send(diet);
  }).catch(next)
});

/*
router.put('/diets/:id', jwtAuth, (req, res, next) => {
    Diet.findByIdAndUpdate({
            _id: req.params.id
        }, req.body)
        .then(function () {
            Diet.findOne({
                _id: req.params.id
            }).then((diet) => {
                res.send(diet);
            });
        });
});
*/

//Delete a routine from the database
router.delete('/diets/:id', jwtAuth, (req, res, next) => {
    Diet.findByIdAndRemove({
            _id: req.params.id
        })
        .then((diet) => {
            res.send(diet);
        });
});


module.exports = {
    router
};