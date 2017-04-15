'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Selling = mongoose.model('Selling'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Selling
 */
exports.create = function(req, res) {
  var selling = new Selling(req.body);
  selling.user = req.user;

  selling.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(selling);
    }
  });
};

/**
 * Show the current Selling
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var selling = req.selling ? req.selling.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  selling.isCurrentUserOwner = req.user && selling.user && selling.user._id.toString() === req.user._id.toString();

  res.jsonp(selling);
};

/**
 * Update a Selling
 */
exports.update = function(req, res) {
  var selling = req.selling;

  selling = _.extend(selling, req.body);

  selling.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(selling);
    }
  });
};

/**
 * Delete an Selling
 */
exports.delete = function(req, res) {
  var selling = req.selling;

  selling.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(selling);
    }
  });
};

/**
 * List of Sellings
 */
exports.list = function(req, res) {
  Selling.find().sort('-created').populate('user', 'displayName').exec(function(err, sellings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sellings);
    }
  });
};

/**
 * Selling middleware
 */
exports.sellingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Selling is invalid'
    });
  }

  Selling.findById(id).populate('user', 'displayName').exec(function (err, selling) {
    if (err) {
      return next(err);
    } else if (!selling) {
      return res.status(404).send({
        message: 'No Selling with that identifier has been found'
      });
    }
    req.selling = selling;
    next();
  });
};
