'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Buying = mongoose.model('Buying'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var populateQuery = {
  path: 'products',
  populate: [{
    path: 'seller',
    select: 'displayName'
  }, {
    path: 'currentBid',
    populate: {
      path: 'bidder',
      select: ['displayName']
    }
  }]
};

/**
 * List of Winning Bids by current user
 */
exports.listWinning = function(req, res) {
  Buying.findOne({
    'user': req.user
  }).sort('-created').populate(populateQuery).exec(function(err, buying) {
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
        if (new Date(product.endsAt) < new Date())
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
  }).sort('-created').populate(populateQuery).exec(function(err, buying) {
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
        if (new Date(product.endsAt) < new Date())
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
  }).sort('-created').populate(populateQuery).exec(function(err, buying) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var products = [];
      for (var i = 0, len = buying.products.length; i < len; i++) {
        var product = buying.products[i];
        if (new Date(product.endsAt) >= new Date() || product.canceled)
          continue;
        if (req.user && product.currentBid.bidder && req.user._id.toString() === product.currentBid.bidder._id.toString()) {
          if (!product.sold) {
            product.sold = true;
            product.save();
            console.log('SAVED sold product from buying');
          }
          products.push(product);
        }
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
  }).sort('-created').populate(populateQuery).exec(function(err, buying) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var products = [];
      for (var i = 0, len = buying.products.length; i < len; i++) {
        var product = buying.products[i];
        if (product.paid && req.user && product.currentBid.bidder && req.user._id.toString() === product.currentBid.bidder._id.toString())
          products.push(product);
      }
      res.jsonp(products);
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
