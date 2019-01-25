"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// this makes the should syntax available throughout
// this module
const should = require("chai").should();
const expect = chai.expect;
const User = require("../models/users-model");
const Diet = require("../models/diets-model");
const { closeServer, runServer, app } = require("../server");
const { TEST_DATABASE_URL, JWT_SECRET } = require("../config");
chai.use(chaiHttp);
// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn("Deleting database");
    mongoose.connection
      .dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}
const username = faker.internet.userName();
const password = faker.internet.password();
describe("Diet API resource", function() {
  before(function() {
    runServer(TEST_DATABASE_URL);
    return User.hashPassword(password).then(password => {
      User.create({ username, password }).then(userData => {
        let newDiet = {
          title: faker.lorem.text(),
          calories: faker.lorem.text(),
          img: faker.image.image(),
          recipe: faker.lorem.text(),
          notes: faker.lorem.text(),
          author: userData.username
        };
        Diete.create(newDiet);
      });
    });
  });
  beforeEach(function() {});
  afterEach(function() {
    // tear down database so we ensure no state from this test
    // effects any coming after.
  });
  after(function() {
    tearDownDb();
    return closeServer();
  });
  // note the use of nested `describe` blocks.
  // this allows us to make clearer, more discrete tests that focus
  // on proving something small
  describe("GET endpoint", function() {
    it("should return all existing diets", function() {
      // strategy:
      //    1. get back all diets returned by GET request to `/posts`
      //    2. prove res has right status, data type
      //    3. prove the number of posts we got back is equal to number
      //       in db.
      let res;
      var token = jwt.sign(
        {
          username,
          password
        },
        JWT_SECRET,
        {
          algorithm: "HS256",
          subject: username,
          expiresIn: "7d"
        }
      );

      User.find({ username: username }).then(users => {
        return chai
          .request(app)
          .get("/api/diets")
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send(newDiet)
          .then(_res => {
            res = _res;
            res.should.have.status(200);
            // otherwise our db seeding didn't work
            res.body.should.have.lengthOf.at.least(1);
            return Diet.count();
          })
          .then(count => {
            // the number of returned posts should be same
            // as number of posts in DB
            res.body.should.have.lengthOf(count);
          });
      });
    });
  });
  it("should return diets with right fields", function() {
    // Strategy: Get back all diets, and ensure they have expected keys
    let res;
    var token = jwt.sign(
      {
        username,
        password
      },
      JWT_SECRET,
      {
        algorithm: "HS256",
        subject: username,
        expiresIn: "7d"
      }
    );

    User.find({ username: username }).then(users => {
      return chai
        .request(app)
        .get("/api/diets")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("array");
          res.body.should.have.lengthOf.at.least(1);
          res.body.forEach(function(dietPost) {
            dietPost.should.be.a("object");
            dietPost.should.include.keys(
              "title",
              "calories",
              "recipe",
              "notes",
              "author"
            );
          });
          // just check one of the posts that its values match with those in db
          // and we'll assume it's true for rest
          resDiet = res.body[0];
          return Diet.findById(resDiet._id);
        })
        .then(diet => {
          resDiet.title.should.equal(diet.title);
          resDiet.calories.should.equal(diet.calories);
          resDiet.recipe.should.equal(diet.recipe);
          resDiet.notes.should.equal(diet.notes);
          resDiet.author.should.equal(diet.author);
        });
    });
  });
  describe("POST endpoint", function() {
    // strategy: make a POST request with data,
    // then prove that the post we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it("should add a new diet", function() {
      let res;
      var token = jwt.sign(
        {
          username,
          password
        },
        JWT_SECRET,
        {
          algorithm: "HS256",
          subject: username,
          expiresIn: "7d"
        }
      );

      User.find({ username: username }).then(users => {
        return chai
          .request(app)
          .post("/api/diets")
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send(newDiet)
          .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
            console.log(res.body);
            res.body.should.be.a("object");
            res.body.should.include.keys(
              "title",
              "calories",
              "recipe",
              "notes",
              "author"
            );
            res.body.title.should.equal(newDiet.title);
            // cause Mongo should have created id on insertion
            res.body._id.should.not.equal(null);
            return Diet.findById(res.body._id);
          })
          .then(diet => {
            diet.title.should.not.equal(null);
            diet.calories.should.not.equal(null);
            diet.recipe.should.not.equal(null);
            diet.notes.should.not.equal(null);
            diet.author.should.not.equal(null);
          });
      });
    });
  });
  describe("diet PUT request", function() {
    it("should update fields sent", function() {
      let res;
      var token = jwt.sign(
        {
          username,
          password
        },
        JWT_SECRET,
        {
          algorithm: "HS256",
          subject: username,
          expiresIn: "7d"
        }
      );

      User.find({ username: username }).then(users => {
        Diet.findOne()
          .then(entry => {
            updateDiet.id = entry.id;
            return chai
              .request(app)
              .put(`/api/diets/${entry.id}`)
              .set("Content-Type", "application/json")
              .set("Accept", "application/json")
              .set("Authorization", `Bearer ${token}`)
              .send(updateDiet);
          })
          .then(function(res) {
            expect(res).to.have.status(200);
            return Diet.findById(updateDiet.id);
          })
          .then(diet => {
            diet.title.should.not.equal(null);
            diet.calories.should.not.equal(null);
            diet.recipe.should.not.equal(null);
            diet.notes.should.not.equal(null);
          });
      });
    });
  });
  //works
  describe("Diet DELETE endpoint", function() {
    it("should delete a diet by id", function() {
      let res;
      var token = jwt.sign(
        {
          username,
          password
        },
        JWT_SECRET,
        {
          algorithm: "HS256",
          subject: username,
          expiresIn: "7d"
        }
      );

      User.find({ username: username }).then(users => {
        Diet.findOne()
          .then(_post => {
            deletedDiet = _post;
            return chai
              .request(app)
              .delete(`/api/diets/${deletedDiet._id}`)
              .set("Content-Type", "application/json")
              .set("Accept", "application/json")
              .set("Authorization", `Bearer ${token}`);
          })
          .then(res => {
            res.should.have.status(200);
            return Diet.findById(deletedDiet._id);
          })
          .then(post => {
            should.not.exist(post);
          });
      });
    });
  });
});
