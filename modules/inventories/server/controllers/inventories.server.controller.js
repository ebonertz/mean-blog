'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Inventory = mongoose.model('Inventory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Inventory
 */
exports.create = function(req, res) {
  var inventory = new Inventory(req.body);
  inventory.user = req.user;

  inventory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inventory);
    }
  });
};

/**
 * Show the current Inventory
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var inventory = req.inventory ? req.inventory.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  inventory.isCurrentUserOwner = req.user && inventory.user && inventory.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(inventory);
};

/**
 * Update a Inventory
 */
exports.update = function(req, res) {
  var inventory = req.inventory ;

  inventory = _.extend(inventory , req.body);

  inventory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inventory);
    }
  });
};

/**
 * Delete an Inventory
 */
exports.delete = function(req, res) {
  var inventory = req.inventory ;

  inventory.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inventory);
    }
  });
};

/**
 * List of Inventories
 */
exports.list = function(req, res) { 
  Inventory.find().sort('-created').populate('user', 'displayName').exec(function(err, inventories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inventories);
    }
  });
};

/**
 * Inventory middleware
 */
exports.inventoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Inventory is invalid'
    });
  }

  Inventory.findById(id).populate('user', 'displayName').exec(function (err, inventory) {
    if (err) {
      return next(err);
    } else if (!inventory) {
      return res.status(404).send({
        message: 'No Inventory with that identifier has been found'
      });
    }
    req.inventory = inventory;
    next();
  });
};
