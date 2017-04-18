'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  multer = require('multer'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  Selling = mongoose.model('Selling'),
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
    }
  });
  console.log('PRODUCT SAVED');
  addToSelling(product, req.user, res);
  console.log('PRODUCT ADDED TO SELLING');
  // changeProductImage(product, req, res);
  // console.log('PRODUCT IMAGE UPDATED');
  // console.log('PRODUCT::::');
  // console.log(product);
  res.jsonp(product);
};

function changeProductImage(product, req, res) {
  var user = req.user;
  var existingImageUrl;

  // Filtering to upload only images
  var multerConfig = config.uploads.product.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newProductImage');

  if (product) {
    existingImageUrl = product.imageURL;
    uploadImage()
      .then(updateProduct)
      .then(deleteOldImage)
      .catch(function(err) {
        console.log('ERROR CAUGHT DURING IMAGE UPLOAD');
        console.log(err);
        res.status(422).send(err);
      });
  } else {
    console.log('USER NOT SIGNED IN DURING IMAGE UPLOAD');
    res.status(401).send({
      message: 'User is not signed in'
    });
  }

  function uploadImage() {
    return new Promise(function(resolve, reject) {
      upload(req, res, function(uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateProduct() {
    return new Promise(function(resolve, reject) {
      console.log('REQUEST');
      console.log(req);
      console.log('REQUEST.FILE');
      console.log(req.file);
      product.imageURL = config.uploads.product.image.dest + req.file.filename;
      // product.save(function(err, theuser) {
      //   if (err) {
      //     reject(err);
      //   } else {
      //     resolve();
      //   }
      // });
    });
  }

  function deleteOldImage() {
    return new Promise(function(resolve, reject) {
      if (existingImageUrl !== Product.schema.path('imageURL').defaultValue) {
        fs.unlink(existingImageUrl, function(unlinkError) {
          if (unlinkError) {
            console.log(unlinkError);
            reject({
              message: 'Error occurred while deleting old profile picture'
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

function addToSelling(product, user, res) {
  var query = {
    'user': user
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
    }
  });
}

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
  }, {
    path: 'bidHistory',
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
