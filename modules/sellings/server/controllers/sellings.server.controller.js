'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Selling = mongoose.model('Selling'),
  Product = mongoose.model('Product'),
  User = mongoose.model('User'),
  Bid = mongoose.model('Bid'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
 * Add item to be sold
 */
exports.sellItem = function(req, res) {
  var that = this;

  var product = new Product(req.body);
  product.seller = req.user;

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });

  var query = {
    'user': req.user
  };

  var update = {
    $addToSet: {
      'products': product._id
    }
  };

  Selling.findOneAndUpdate(query, update, {
    upsert: true
  }, function(err, doc) {
    if (err) {
      return res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });

};

/**
 * List of Active Items on auction for current user
 */
exports.listActiveItems = function(req, res) {
  Product.find({
    'seller': req.user,
    'sold': false,
    'canceled': false,
    'endsAt': {
      $gt: new Date()
    }
  }).sort('-created').populate([{
    path: 'currentBid',
    select: 'displayName'
  }, {
    path: 'currentBid'
  }]).exec(function(err, sellings) {
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
 * List of Sold Items on auction for current user
 */
exports.listSoldItems = function(req, res) {
  Product.find({
    'seller': req.user,
    'sold': true,
    'canceled': false,
    'endsAt': {
      $lt: new Date()
    }
  }).sort('-created').populate([{
    path: 'currentBid',
    select: 'displayName'
  }, {
    path: 'currentBid'
  }]).exec(function(err, sellings) {
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
 * List of Sold Items on auction for current user
 */
exports.listUnsoldItems = function(req, res) {
  Product.find({
    'seller': req.user,
    'sold': false,
    'canceled': false,
    'endsAt': {
      $lt: new Date()
    }
  }).sort('-created').populate([{
    path: 'currentBid',
    select: 'displayName'
  }, {
    path: 'currentBid'
  }]).exec(function(err, sellings) {
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
 * List of Sold Items on auction for current user
 */
exports.listCanceledItems = function(req, res) {
  Product.find({
    'seller': req.user,
    'sold': false,
    'canceled': true
  }).sort('-created').populate([{
    path: 'currentBid',
    select: 'displayName'
  }, {
    path: 'currentBid'
  }]).exec(function(err, sellings) {
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
