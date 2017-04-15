'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Buying = mongoose.model('Buying'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  buying;

/**
 * Buying routes tests
 */
describe('Buying CRUD tests', function () {

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

    // Save a user to the test db and create new Buying
    user.save(function () {
      buying = {
        name: 'Buying name'
      };

      done();
    });
  });

  it('should be able to save a Buying if logged in', function (done) {
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

        // Save a new Buying
        agent.post('/api/buyings')
          .send(buying)
          .expect(200)
          .end(function (buyingSaveErr, buyingSaveRes) {
            // Handle Buying save error
            if (buyingSaveErr) {
              return done(buyingSaveErr);
            }

            // Get a list of Buyings
            agent.get('/api/buyings')
              .end(function (buyingsGetErr, buyingsGetRes) {
                // Handle Buyings save error
                if (buyingsGetErr) {
                  return done(buyingsGetErr);
                }

                // Get Buyings list
                var buyings = buyingsGetRes.body;

                // Set assertions
                (buyings[0].user._id).should.equal(userId);
                (buyings[0].name).should.match('Buying name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Buying if not logged in', function (done) {
    agent.post('/api/buyings')
      .send(buying)
      .expect(403)
      .end(function (buyingSaveErr, buyingSaveRes) {
        // Call the assertion callback
        done(buyingSaveErr);
      });
  });

  it('should not be able to save an Buying if no name is provided', function (done) {
    // Invalidate name field
    buying.name = '';

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

        // Save a new Buying
        agent.post('/api/buyings')
          .send(buying)
          .expect(400)
          .end(function (buyingSaveErr, buyingSaveRes) {
            // Set message assertion
            (buyingSaveRes.body.message).should.match('Please fill Buying name');

            // Handle Buying save error
            done(buyingSaveErr);
          });
      });
  });

  it('should be able to update an Buying if signed in', function (done) {
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

        // Save a new Buying
        agent.post('/api/buyings')
          .send(buying)
          .expect(200)
          .end(function (buyingSaveErr, buyingSaveRes) {
            // Handle Buying save error
            if (buyingSaveErr) {
              return done(buyingSaveErr);
            }

            // Update Buying name
            buying.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Buying
            agent.put('/api/buyings/' + buyingSaveRes.body._id)
              .send(buying)
              .expect(200)
              .end(function (buyingUpdateErr, buyingUpdateRes) {
                // Handle Buying update error
                if (buyingUpdateErr) {
                  return done(buyingUpdateErr);
                }

                // Set assertions
                (buyingUpdateRes.body._id).should.equal(buyingSaveRes.body._id);
                (buyingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Buyings if not signed in', function (done) {
    // Create new Buying model instance
    var buyingObj = new Buying(buying);

    // Save the buying
    buyingObj.save(function () {
      // Request Buyings
      request(app).get('/api/buyings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Buying if not signed in', function (done) {
    // Create new Buying model instance
    var buyingObj = new Buying(buying);

    // Save the Buying
    buyingObj.save(function () {
      request(app).get('/api/buyings/' + buyingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', buying.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Buying with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/buyings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Buying is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Buying which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Buying
    request(app).get('/api/buyings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Buying with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Buying if signed in', function (done) {
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

        // Save a new Buying
        agent.post('/api/buyings')
          .send(buying)
          .expect(200)
          .end(function (buyingSaveErr, buyingSaveRes) {
            // Handle Buying save error
            if (buyingSaveErr) {
              return done(buyingSaveErr);
            }

            // Delete an existing Buying
            agent.delete('/api/buyings/' + buyingSaveRes.body._id)
              .send(buying)
              .expect(200)
              .end(function (buyingDeleteErr, buyingDeleteRes) {
                // Handle buying error error
                if (buyingDeleteErr) {
                  return done(buyingDeleteErr);
                }

                // Set assertions
                (buyingDeleteRes.body._id).should.equal(buyingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Buying if not signed in', function (done) {
    // Set Buying user
    buying.user = user;

    // Create new Buying model instance
    var buyingObj = new Buying(buying);

    // Save the Buying
    buyingObj.save(function () {
      // Try deleting Buying
      request(app).delete('/api/buyings/' + buyingObj._id)
        .expect(403)
        .end(function (buyingDeleteErr, buyingDeleteRes) {
          // Set message assertion
          (buyingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Buying error error
          done(buyingDeleteErr);
        });

    });
  });

  it('should be able to get a single Buying that has an orphaned user reference', function (done) {
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

          // Save a new Buying
          agent.post('/api/buyings')
            .send(buying)
            .expect(200)
            .end(function (buyingSaveErr, buyingSaveRes) {
              // Handle Buying save error
              if (buyingSaveErr) {
                return done(buyingSaveErr);
              }

              // Set assertions on new Buying
              (buyingSaveRes.body.name).should.equal(buying.name);
              should.exist(buyingSaveRes.body.user);
              should.equal(buyingSaveRes.body.user._id, orphanId);

              // force the Buying to have an orphaned user reference
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

                    // Get the Buying
                    agent.get('/api/buyings/' + buyingSaveRes.body._id)
                      .expect(200)
                      .end(function (buyingInfoErr, buyingInfoRes) {
                        // Handle Buying error
                        if (buyingInfoErr) {
                          return done(buyingInfoErr);
                        }

                        // Set assertions
                        (buyingInfoRes.body._id).should.equal(buyingSaveRes.body._id);
                        (buyingInfoRes.body.name).should.equal(buying.name);
                        should.equal(buyingInfoRes.body.user, undefined);

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
      Buying.remove().exec(done);
    });
  });
});
