'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sellingcart = mongoose.model('Sellingcart'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  sellingcart;

/**
 * Sellingcart routes tests
 */
describe('Sellingcart CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Sellingcart
    user.save(function () {
      sellingcart = {
        name: 'Sellingcart name'
      };

      done();
    });
  });

  it('should be able to save a Sellingcart if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Sellingcart
        agent.post('/api/sellingcarts')
          .send(sellingcart)
          .expect(200)
          .end(function (sellingcartSaveErr, sellingcartSaveRes) {
            // Handle Sellingcart save error
            if (sellingcartSaveErr) {
              return done(sellingcartSaveErr);
            }

            // Get a list of Sellingcarts
            agent.get('/api/sellingcarts')
              .end(function (sellingcartsGetErr, sellingcartsGetRes) {
                // Handle Sellingcarts save error
                if (sellingcartsGetErr) {
                  return done(sellingcartsGetErr);
                }

                // Get Sellingcarts list
                var sellingcarts = sellingcartsGetRes.body;

                // Set assertions
                (sellingcarts[0].user._id).should.equal(userId);
                (sellingcarts[0].name).should.match('Sellingcart name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sellingcart if not logged in', function (done) {
    agent.post('/api/sellingcarts')
      .send(sellingcart)
      .expect(403)
      .end(function (sellingcartSaveErr, sellingcartSaveRes) {
        // Call the assertion callback
        done(sellingcartSaveErr);
      });
  });

  it('should not be able to save an Sellingcart if no name is provided', function (done) {
    // Invalidate name field
    sellingcart.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Sellingcart
        agent.post('/api/sellingcarts')
          .send(sellingcart)
          .expect(400)
          .end(function (sellingcartSaveErr, sellingcartSaveRes) {
            // Set message assertion
            (sellingcartSaveRes.body.message).should.match('Please fill Sellingcart name');

            // Handle Sellingcart save error
            done(sellingcartSaveErr);
          });
      });
  });

  it('should be able to update an Sellingcart if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Sellingcart
        agent.post('/api/sellingcarts')
          .send(sellingcart)
          .expect(200)
          .end(function (sellingcartSaveErr, sellingcartSaveRes) {
            // Handle Sellingcart save error
            if (sellingcartSaveErr) {
              return done(sellingcartSaveErr);
            }

            // Update Sellingcart name
            sellingcart.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sellingcart
            agent.put('/api/sellingcarts/' + sellingcartSaveRes.body._id)
              .send(sellingcart)
              .expect(200)
              .end(function (sellingcartUpdateErr, sellingcartUpdateRes) {
                // Handle Sellingcart update error
                if (sellingcartUpdateErr) {
                  return done(sellingcartUpdateErr);
                }

                // Set assertions
                (sellingcartUpdateRes.body._id).should.equal(sellingcartSaveRes.body._id);
                (sellingcartUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sellingcarts if not signed in', function (done) {
    // Create new Sellingcart model instance
    var sellingcartObj = new Sellingcart(sellingcart);

    // Save the sellingcart
    sellingcartObj.save(function () {
      // Request Sellingcarts
      request(app).get('/api/sellingcarts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sellingcart if not signed in', function (done) {
    // Create new Sellingcart model instance
    var sellingcartObj = new Sellingcart(sellingcart);

    // Save the Sellingcart
    sellingcartObj.save(function () {
      request(app).get('/api/sellingcarts/' + sellingcartObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sellingcart.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sellingcart with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sellingcarts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sellingcart is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sellingcart which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sellingcart
    request(app).get('/api/sellingcarts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sellingcart with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sellingcart if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Sellingcart
        agent.post('/api/sellingcarts')
          .send(sellingcart)
          .expect(200)
          .end(function (sellingcartSaveErr, sellingcartSaveRes) {
            // Handle Sellingcart save error
            if (sellingcartSaveErr) {
              return done(sellingcartSaveErr);
            }

            // Delete an existing Sellingcart
            agent.delete('/api/sellingcarts/' + sellingcartSaveRes.body._id)
              .send(sellingcart)
              .expect(200)
              .end(function (sellingcartDeleteErr, sellingcartDeleteRes) {
                // Handle sellingcart error error
                if (sellingcartDeleteErr) {
                  return done(sellingcartDeleteErr);
                }

                // Set assertions
                (sellingcartDeleteRes.body._id).should.equal(sellingcartSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sellingcart if not signed in', function (done) {
    // Set Sellingcart user
    sellingcart.user = user;

    // Create new Sellingcart model instance
    var sellingcartObj = new Sellingcart(sellingcart);

    // Save the Sellingcart
    sellingcartObj.save(function () {
      // Try deleting Sellingcart
      request(app).delete('/api/sellingcarts/' + sellingcartObj._id)
        .expect(403)
        .end(function (sellingcartDeleteErr, sellingcartDeleteRes) {
          // Set message assertion
          (sellingcartDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sellingcart error error
          done(sellingcartDeleteErr);
        });

    });
  });

  it('should be able to get a single Sellingcart that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Sellingcart
          agent.post('/api/sellingcarts')
            .send(sellingcart)
            .expect(200)
            .end(function (sellingcartSaveErr, sellingcartSaveRes) {
              // Handle Sellingcart save error
              if (sellingcartSaveErr) {
                return done(sellingcartSaveErr);
              }

              // Set assertions on new Sellingcart
              (sellingcartSaveRes.body.name).should.equal(sellingcart.name);
              should.exist(sellingcartSaveRes.body.user);
              should.equal(sellingcartSaveRes.body.user._id, orphanId);

              // force the Sellingcart to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Sellingcart
                    agent.get('/api/sellingcarts/' + sellingcartSaveRes.body._id)
                      .expect(200)
                      .end(function (sellingcartInfoErr, sellingcartInfoRes) {
                        // Handle Sellingcart error
                        if (sellingcartInfoErr) {
                          return done(sellingcartInfoErr);
                        }

                        // Set assertions
                        (sellingcartInfoRes.body._id).should.equal(sellingcartSaveRes.body._id);
                        (sellingcartInfoRes.body.name).should.equal(sellingcart.name);
                        should.equal(sellingcartInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Sellingcart.remove().exec(done);
    });
  });
});
