'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Selling = mongoose.model('Selling'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  selling;

/**
 * Selling routes tests
 */
describe('Selling CRUD tests', function () {

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

    // Save a user to the test db and create new Selling
    user.save(function () {
      selling = {
        name: 'Selling name'
      };

      done();
    });
  });

  it('should be able to save a Selling if logged in', function (done) {
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

        // Save a new Selling
        agent.post('/api/sellings')
          .send(selling)
          .expect(200)
          .end(function (sellingSaveErr, sellingSaveRes) {
            // Handle Selling save error
            if (sellingSaveErr) {
              return done(sellingSaveErr);
            }

            // Get a list of Sellings
            agent.get('/api/sellings')
              .end(function (sellingsGetErr, sellingsGetRes) {
                // Handle Sellings save error
                if (sellingsGetErr) {
                  return done(sellingsGetErr);
                }

                // Get Sellings list
                var sellings = sellingsGetRes.body;

                // Set assertions
                (sellings[0].user._id).should.equal(userId);
                (sellings[0].name).should.match('Selling name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Selling if not logged in', function (done) {
    agent.post('/api/sellings')
      .send(selling)
      .expect(403)
      .end(function (sellingSaveErr, sellingSaveRes) {
        // Call the assertion callback
        done(sellingSaveErr);
      });
  });

  it('should not be able to save an Selling if no name is provided', function (done) {
    // Invalidate name field
    selling.name = '';

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

        // Save a new Selling
        agent.post('/api/sellings')
          .send(selling)
          .expect(400)
          .end(function (sellingSaveErr, sellingSaveRes) {
            // Set message assertion
            (sellingSaveRes.body.message).should.match('Please fill Selling name');

            // Handle Selling save error
            done(sellingSaveErr);
          });
      });
  });

  it('should be able to update an Selling if signed in', function (done) {
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

        // Save a new Selling
        agent.post('/api/sellings')
          .send(selling)
          .expect(200)
          .end(function (sellingSaveErr, sellingSaveRes) {
            // Handle Selling save error
            if (sellingSaveErr) {
              return done(sellingSaveErr);
            }

            // Update Selling name
            selling.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Selling
            agent.put('/api/sellings/' + sellingSaveRes.body._id)
              .send(selling)
              .expect(200)
              .end(function (sellingUpdateErr, sellingUpdateRes) {
                // Handle Selling update error
                if (sellingUpdateErr) {
                  return done(sellingUpdateErr);
                }

                // Set assertions
                (sellingUpdateRes.body._id).should.equal(sellingSaveRes.body._id);
                (sellingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sellings if not signed in', function (done) {
    // Create new Selling model instance
    var sellingObj = new Selling(selling);

    // Save the selling
    sellingObj.save(function () {
      // Request Sellings
      request(app).get('/api/sellings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Selling if not signed in', function (done) {
    // Create new Selling model instance
    var sellingObj = new Selling(selling);

    // Save the Selling
    sellingObj.save(function () {
      request(app).get('/api/sellings/' + sellingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', selling.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Selling with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sellings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Selling is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Selling which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Selling
    request(app).get('/api/sellings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Selling with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Selling if signed in', function (done) {
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

        // Save a new Selling
        agent.post('/api/sellings')
          .send(selling)
          .expect(200)
          .end(function (sellingSaveErr, sellingSaveRes) {
            // Handle Selling save error
            if (sellingSaveErr) {
              return done(sellingSaveErr);
            }

            // Delete an existing Selling
            agent.delete('/api/sellings/' + sellingSaveRes.body._id)
              .send(selling)
              .expect(200)
              .end(function (sellingDeleteErr, sellingDeleteRes) {
                // Handle selling error error
                if (sellingDeleteErr) {
                  return done(sellingDeleteErr);
                }

                // Set assertions
                (sellingDeleteRes.body._id).should.equal(sellingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Selling if not signed in', function (done) {
    // Set Selling user
    selling.user = user;

    // Create new Selling model instance
    var sellingObj = new Selling(selling);

    // Save the Selling
    sellingObj.save(function () {
      // Try deleting Selling
      request(app).delete('/api/sellings/' + sellingObj._id)
        .expect(403)
        .end(function (sellingDeleteErr, sellingDeleteRes) {
          // Set message assertion
          (sellingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Selling error error
          done(sellingDeleteErr);
        });

    });
  });

  it('should be able to get a single Selling that has an orphaned user reference', function (done) {
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

          // Save a new Selling
          agent.post('/api/sellings')
            .send(selling)
            .expect(200)
            .end(function (sellingSaveErr, sellingSaveRes) {
              // Handle Selling save error
              if (sellingSaveErr) {
                return done(sellingSaveErr);
              }

              // Set assertions on new Selling
              (sellingSaveRes.body.name).should.equal(selling.name);
              should.exist(sellingSaveRes.body.user);
              should.equal(sellingSaveRes.body.user._id, orphanId);

              // force the Selling to have an orphaned user reference
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

                    // Get the Selling
                    agent.get('/api/sellings/' + sellingSaveRes.body._id)
                      .expect(200)
                      .end(function (sellingInfoErr, sellingInfoRes) {
                        // Handle Selling error
                        if (sellingInfoErr) {
                          return done(sellingInfoErr);
                        }

                        // Set assertions
                        (sellingInfoRes.body._id).should.equal(sellingSaveRes.body._id);
                        (sellingInfoRes.body.name).should.equal(selling.name);
                        should.equal(sellingInfoRes.body.user, undefined);

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
      Selling.remove().exec(done);
    });
  });
});
