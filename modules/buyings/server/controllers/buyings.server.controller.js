'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Buying = mongoose.model('Buying'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Buying
 */
exports.create = function(req, res) {
  var buying = new Buying(req.body);
  buying.user = req.user;

  buying.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(buying);
    }
  });
};

/**
 * Show the current Buying
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var buying = req.buying ? req.buying.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  buying.isCurrentUserOwner = req.user && buying.user && buying.user._id.toString() === req.user._id.toString();

  res.jsonp(buying);
};

/**
 * Update a Buying
 */
exports.update = function(req, res) {
  var buying = req.buying;

  buying = _.extend(buying, req.body);

  buying.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(buying);
    }
  });
};

/**
 * Delete an Buying
 */
exports.delete = function(req, res) {
  var buying = req.buying;

  buying.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(buying);
    }
  });
};

/**
 * List of Winning Bids by current user
 */
exports.listWinning = function(req, res) {
  Buying.findOne({
    'user': req.user
  }).sort('-created').populate({
    path: 'products',
    populate: [{
      path: 'seller',
      select: 'displayName'
    }, {
      path: 'currentBid',
      populate: {
        path: 'bidder',
        select: 'displayName'
      }
    }]
  }).exec(function(err, buying) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var products = [];
      for (var i = 0, len = buying.products.length; i < len; i++) {
        var product = buying.products[i];
        if (product.sold || product.canceled)
          continue;
        if (product.endsAt < new Date())
          continue;
        if (req.user && product.currentBid.bidder && req.user._id.toString() === product.currentBid.bidder._id.toString())
          products.push(product);
      }
      res.jsonp(products);
    }
  });
};

/**
 * List of Losing Bids by current user
 */
exports.listLosing = function(req, res) {
  Buying.findOne({
    'user': req.user
  }).sort('-created').populate({
    path: 'products',
    populate: [{
      path: 'seller',
      select: 'displayName'
    }, {
      path: 'currentBid',
      populate: {
        path: 'bidder',
        select: 'displayName'
      }
    }]
  }).exec(function(err, buying) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var products = [];
      for (var i = 0, len = buying.products.length; i < len; i++) {
        var product = buying.products[i];
        if (product.sold || product.canceled)
          continue;
        if (product.endsAt < new Date())
          continue;
        if (req.user && product.currentBid.bidder && req.user._id.toString() !== product.currentBid.bidder._id.toString())
          products.push(product);
      }
      res.jsonp(products);
    }
  });
};

/**
 * List of Won Bids by current user
 */
exports.listWon = function(req, res) {
  Buying.findOne({
    'user': req.user
  }).sort('-created').populate({
    path: 'products',
    populate: [{
      path: 'seller',
      select: 'displayName'
    }, {
      path: 'currentBid',
      populate: {
        path: 'bidder',
        select: 'displayName'
      }
    }]
  }).exec(function(err, buying) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var products = [];
      for (var i = 0, len = buying.products.length; i < len; i++) {
        var product = buying.products[i];
        if (product.endsAt >= new Date() || product.canceled)
          continue;
        if (req.user && product.currentBid.bidder && req.user._id.toString() === product.currentBid.bidder._id.toString())
          products.push(product);
      }
      res.jsonp(products);
    }
  });
};


/**
 * List of Purchased by current user
 */
exports.listPurchased = function(req, res) {
  Buying.findOne({
    'user': req.user
  }).sort('-created').populate({
    path: 'products',
    populate: [{
      path: 'seller',
      select: 'displayName'
    }, {
      path: 'currentBid',
      populate: {
        path: 'bidder',
        select: 'displayName'
      }
    }]
  }).exec(function(err, buying) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var products = [];
      for (var i = 0, len = buying.products.length; i < len; i++) {
        var product = buying.products[i];
        if (product.endsAt >= new Date() || product.canceled)
          continue;
        if (product.sold && req.user && product.currentBid.bidder && req.user._id.toString() === product.currentBid.bidder._id.toString())
          products.push(product);
      }
      res.jsonp(products);
    }
  });
};

/**
 * List of Buyings
 */
exports.list = function(req, res) {
  Buying.find().sort('-created').populate('user', 'displayName').exec(function(err, buyings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(buyings);
    }
  });
};

/**
 * Buying middleware
 */
exports.buyingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Buying is invalid'
    });
  }

  Buying.findById(id).populate('user', 'displayName').exec(function(err, buying) {
    if (err) {
      return next(err);
    } else if (!buying) {
      return res.status(404).send({
        message: 'No Buying with that identifier has been found'
      });
    }
    req.buying = buying;
    next();
  });
};
