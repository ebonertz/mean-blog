'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Inventory = mongoose.model('Inventory'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, inventory;

/**
 * Inventory routes tests
 */
describe('Inventory CRUD tests', function () {

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

    // Save a user to the test db and create new Inventory
    user.save(function () {
      inventory = {
        name: 'Inventory name'
      };

      done();
    });
  });

  it('should be able to save a Inventory if logged in', function (done) {
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

        // Save a new Inventory
        agent.post('/api/inventories')
          .send(inventory)
          .expect(200)
          .end(function (inventorySaveErr, inventorySaveRes) {
            // Handle Inventory save error
            if (inventorySaveErr) {
              return done(inventorySaveErr);
            }

            // Get a list of Inventories
            agent.get('/api/inventories')
              .end(function (inventorysGetErr, inventorysGetRes) {
                // Handle Inventory save error
                if (inventorysGetErr) {
                  return done(inventorysGetErr);
                }

                // Get Inventories list
                var inventories = inventoriesGetRes.body;

                // Set assertions
                (inventories[0].user._id).should.equal(userId);
                (inventories[0].name).should.match('Inventory name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Inventory if not logged in', function (done) {
    agent.post('/api/inventories')
      .send(inventory)
      .expect(403)
      .end(function (inventorySaveErr, inventorySaveRes) {
        // Call the assertion callback
        done(inventorySaveErr);
      });
  });

  it('should not be able to save an Inventory if no name is provided', function (done) {
    // Invalidate name field
    inventory.name = '';

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

        // Save a new Inventory
        agent.post('/api/inventories')
          .send(inventory)
          .expect(400)
          .end(function (inventorySaveErr, inventorySaveRes) {
            // Set message assertion
            (inventorySaveRes.body.message).should.match('Please fill Inventory name');

            // Handle Inventory save error
            done(inventorySaveErr);
          });
      });
  });

  it('should be able to update an Inventory if signed in', function (done) {
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

        // Save a new Inventory
        agent.post('/api/inventories')
          .send(inventory)
          .expect(200)
          .end(function (inventorySaveErr, inventorySaveRes) {
            // Handle Inventory save error
            if (inventorySaveErr) {
              return done(inventorySaveErr);
            }

            // Update Inventory name
            inventory.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Inventory
            agent.put('/api/inventories/' + inventorySaveRes.body._id)
              .send(inventory)
              .expect(200)
              .end(function (inventoryUpdateErr, inventoryUpdateRes) {
                // Handle Inventory update error
                if (inventoryUpdateErr) {
                  return done(inventoryUpdateErr);
                }

                // Set assertions
                (inventoryUpdateRes.body._id).should.equal(inventorySaveRes.body._id);
                (inventoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Inventories if not signed in', function (done) {
    // Create new Inventory model instance
    var inventoryObj = new Inventory(inventory);

    // Save the inventory
    inventoryObj.save(function () {
      // Request Inventories
      request(app).get('/api/inventories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Inventory if not signed in', function (done) {
    // Create new Inventory model instance
    var inventoryObj = new Inventory(inventory);

    // Save the Inventory
    inventoryObj.save(function () {
      request(app).get('/api/inventories/' + inventoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', inventory.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Inventory with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/inventories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Inventory is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Inventory which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Inventory
    request(app).get('/api/inventories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Inventory with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Inventory if signed in', function (done) {
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

        // Save a new Inventory
        agent.post('/api/inventories')
          .send(inventory)
          .expect(200)
          .end(function (inventorySaveErr, inventorySaveRes) {
            // Handle Inventory save error
            if (inventorySaveErr) {
              return done(inventorySaveErr);
            }

            // Delete an existing Inventory
            agent.delete('/api/inventories/' + inventorySaveRes.body._id)
              .send(inventory)
              .expect(200)
              .end(function (inventoryDeleteErr, inventoryDeleteRes) {
                // Handle inventory error error
                if (inventoryDeleteErr) {
                  return done(inventoryDeleteErr);
                }

                // Set assertions
                (inventoryDeleteRes.body._id).should.equal(inventorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Inventory if not signed in', function (done) {
    // Set Inventory user
    inventory.user = user;

    // Create new Inventory model instance
    var inventoryObj = new Inventory(inventory);

    // Save the Inventory
    inventoryObj.save(function () {
      // Try deleting Inventory
      request(app).delete('/api/inventories/' + inventoryObj._id)
        .expect(403)
        .end(function (inventoryDeleteErr, inventoryDeleteRes) {
          // Set message assertion
          (inventoryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Inventory error error
          done(inventoryDeleteErr);
        });

    });
  });

  it('should be able to get a single Inventory that has an orphaned user reference', function (done) {
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

          // Save a new Inventory
          agent.post('/api/inventories')
            .send(inventory)
            .expect(200)
            .end(function (inventorySaveErr, inventorySaveRes) {
              // Handle Inventory save error
              if (inventorySaveErr) {
                return done(inventorySaveErr);
              }

              // Set assertions on new Inventory
              (inventorySaveRes.body.name).should.equal(inventory.name);
              should.exist(inventorySaveRes.body.user);
              should.equal(inventorySaveRes.body.user._id, orphanId);

              // force the Inventory to have an orphaned user reference
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

                    // Get the Inventory
                    agent.get('/api/inventories/' + inventorySaveRes.body._id)
                      .expect(200)
                      .end(function (inventoryInfoErr, inventoryInfoRes) {
                        // Handle Inventory error
                        if (inventoryInfoErr) {
                          return done(inventoryInfoErr);
                        }

                        // Set assertions
                        (inventoryInfoRes.body._id).should.equal(inventorySaveRes.body._id);
                        (inventoryInfoRes.body.name).should.equal(inventory.name);
                        should.equal(inventoryInfoRes.body.user, undefined);

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
      Inventory.remove().exec(done);
    });
  });
});
