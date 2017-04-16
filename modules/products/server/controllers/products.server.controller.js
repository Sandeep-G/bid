'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  Bid = mongoose.model('Bid'),
  Buying = mongoose.model('Buying'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Product
 */
exports.create = function(req, res) {
  var product = new Product(req.body);
  product.seller = req.user;

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.seller && product.seller._id.toString() === req.user._id.toString();

  res.jsonp(product);
};

/**
 * Update a Product
 */
exports.update = function(req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Save current user's bid for the product
 */
exports.bid = function(req, res) {
  var product = req.product;
  var user = req.user;
  var body = req.body;
  var newBid = new Bid({
    bidder: user,
    amount: req.query.amount
  });

  if (product.currentBid === null || typeof product.currentBid === 'undefined' || product.currentBid < newBid.amount) {
    newBid.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'New bid not greater than current bid'
    });
  }

  product.currentBid = newBid;
  product.bidHistory.push(newBid);

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

  Buying.findOneAndUpdate(query, update, {
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
 * Delete an Product
 */
exports.delete = function(req, res) {
  var product = req.product;
  product.canceled = true;

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function(req, res) {
  Product.find().sort('-created').populate([{
    path: 'seller',
    select: 'displayName'
  }, {
    path: 'currentBid',
    populate: {
      path: 'bidder',
      select: 'displayName'
    }
  }]).exec(function(err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(products);
    }
  });
};

/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate([{
    path: 'seller',
    select: 'displayName'
  }, {
    path: 'currentBid',
    populate: {
      path: 'bidder',
      select: 'displayName'
    }
  }]).exec(function(err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No Product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};
