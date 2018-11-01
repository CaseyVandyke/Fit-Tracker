/*'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = require('chai').should();
const faker = require('faker');
const jwt = require('jsonwebtoken');

const User = require('../models/users-model');
const {
    app,
    runServer,
    closeServer,
} = require('../server');
const {
    TEST_DATABASE_URL,
    JWT_SECRET
} = require('../config');


chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about.
function seedFakeUserDb() {
    console.info('seeding fake user db');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateUserData());
    }
    //this will return a promise
    return User.insertMany(seedData);

}

function generateUserData() {
    return {
        username: faker.internet.userName(),
        password: faker.internet.password()
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}


describe('User api routes', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedFakeUserDb();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    
    describe('GET all users in database', function () {
        it('should get all users in the database', function () {
            let user = generateUserData();
            var token = jwt.sign({
                user
            }, JWT_SECRET);

            return chai.request(app)
                .get('/api/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .then(res => {
                    res.should.have.status(200);
                    res.should.be.json;
                });
        });
    });

    describe('POST request for /users', function () {
        it('should create a new user in the database', function () {
            let user = generateUserData();
            const newUser = {
                username: faker.internet.userName(),
                password: faker.internet.password()
            };
            var token = jwt.sign({
                user
            }, JWT_SECRET);
            return chai.request(app)
                .post('/api/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(newUser)
                .then(function (res) {
                    res.should.have.status(201);
                    res.should.be.json;
                });
        });
    });

describe('PUT request for /users/:id', function () {
    it('should update a user in the database with a specific id', function () {
        let user = generateUserData();
        var token = jwt.sign({
            user
        }, JWT_SECRET);

        let updateData = {
            username: faker.internet.userName()
        }

        User
            .findOne()
            .then(user => {
                return chai.request(app)
                    .put(`/users/${user.id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send(updateData);
            })
            .then(res => {
                res.should.have.status(204);
            })
            .then(updatedUser => {
                updatedUser.should.deep.equal(updateData);
            });

    });
});

//works
describe('DELETE request for /users/:id', function () {
    it('should delete a user from the database', function () {
        let deletedUser;
        let user = generateUserData();
        var token = jwt.sign({
            user
        }, JWT_SECRET);

        User
            .findOne()
            .then(user => {
                deletedUser = user._id;
                return chai.request(app)
                    .delete(`/users/${deletedUser}`)
                    .set('Authorization', `Bearer ${token}`)
            })
            .then(res => {
                res.should.have.status(204);
                return User.findById(deletedUser);
            })
            .then(deleted => {
                should.not.exist(deleted);
            });

    });
});
});
*/