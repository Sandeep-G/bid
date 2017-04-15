'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sellingcart = mongoose.model('Sellingcart'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Sellingcart
 */
exports.create = function(req, res) {
  var sellingcart = new Sellingcart(req.body);
  sellingcart.user = req.user;

  sellingcart.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sellingcart);
    }
  });
};

/**
 * Show the current Sellingcart
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sellingcart = req.sellingcart ? req.sellingcart.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sellingcart.isCurrentUserOwner = req.user && sellingcart.user && sellingcart.user._id.toString() === req.user._id.toString();

  res.jsonp(sellingcart);
};

/**
 * Update a Sellingcart
 */
exports.update = function(req, res) {
  var sellingcart = req.sellingcart;

  sellingcart = _.extend(sellingcart, req.body);

  sellingcart.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sellingcart);
    }
  });
};

/**
 * Delete an Sellingcart
 */
exports.delete = function(req, res) {
  var sellingcart = req.sellingcart;

  sellingcart.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sellingcart);
    }
  });
};

/**
 * List of Sellingcarts
 */
exports.list = function(req, res) {
  Sellingcart.find().sort('-created').populate('user', 'displayName').exec(function(err, sellingcarts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sellingcarts);
    }
  });
};

/**
 * Sellingcart middleware
 */
exports.sellingcartByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sellingcart is invalid'
    });
  }

  Sellingcart.findById(id).populate('user', 'displayName').exec(function (err, sellingcart) {
    if (err) {
      return next(err);
    } else if (!sellingcart) {
      return res.status(404).send({
        message: 'No Sellingcart with that identifier has been found'
      });
    }
    req.sellingcart = sellingcart;
    next();
  });
};
