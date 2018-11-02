/*const assert = require('assert');

describe ('demo test', function() {

    it('adds two numbers', function() {
        assert(2 + 3 === 5);
    })
})

*/

"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../models/users-model');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth endpoints', function() {
    const username = 'exampleUser';
    const password = 'examplePass';

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return User.hashPassword(password).then(password => 
            User.create({
                username,
                password
            })
        );
    });

    afterEach(function() {
        return User.remove({});
    });

    after(function() {
        return closeServer();
    });

    describe('api/auth/login', function() {
        it('should reject requests with no credentials', function() {
            return chai.request(app)
            .post('api/auth/login')
            .then((res) => {
                expect(res).to.have.status(400);
            });
        });

        it('should reject requests with incorrect username', function() {
            return chai.request(app)
            .post('api/auth/login')
            .send({
                username: 'wrongUser',
                password
            })
            .then((res) => {
                expect(res).to.have.status(401);
            });
        });

        it('should reject requests with incorrect password', function() {
            return chai.request(app)
            .post('api/auth/login')
            .send({
                username,
                password: 'wrongPass'
            })
            .then((res) => {
                expect(res).to.have.status(401);
            });
        });

        it('should return a valid token', function() {
            return chai.request(app)
            .post('api/auth/login')
            .send({
                username,
                password
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                const token = res.body.authToken;
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, JWT_SECRET, {
                    algorithm: ['HS256']
                });
                expect(payload.user).to.equal({
                    firstName,
                    lastName,
                    username
                });
            });
        });
    });

    describe('api/auth/refresh', function() {
        it('should reject requests with no credentials', function() {
            return chai.request(app)
            .post('api/auth/refresh')
            .then((res) => {
                expect(res).to.have.status(401);
            });
        });

        it('should reject requests with an invalid token', function() {
            const token = jwt.sign ({
                username
            },
                'wrongSecret',
            {
                algorithm: 'HS256',
                expiresIn: '7d'
            }
            );
            return chai.request(app)
            .post('api/auth/refresh')
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
                expect(res).to.have.status(401);
            });
        });

        it('should reject requests with an expired token', function() {
            const token = jwt.sign({
                user : {
                    username
                },
            },
            JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: Math.floor(Date.now() / 1000) - 10 
                }
            );
            return chai.request(app)
            .post('api/auth/refresh')
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
                expect(res).to.have.status(200);
            });
        });

        it('should return a valid token with newer expiry date', function() {
            const token = jwt.sign({
                user: {
                    username
                },
            },
            JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            const decoded = jwt.decode(token);

            return chai.request(app)
            .post('api/auth/refresh')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                const token = res.body.authToken;
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, JWT_SECRET, {
                    algorithm: ['HS256']
                });
                expect(payload.user).to.deep.equal({
                    username
                });
                expect(payload.exp).to.be.at.least(decoded.exp);
            });
        });
    });

})
