'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function(app) {
  // Products Routes
  app.route('/api/products').all(productsPolicy.isAllowed)
    .get(products.list)
    .post(products.create);

  app.route('/api/products/search').all(productsPolicy.isAllowed)
    .post(products.search);

  app.route('/api/products/:productId').all(productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update)
    .delete(products.delete);

  app.route('/api/products/:productId/bid').all(productsPolicy.isAllowed)
    .put(products.bid);

  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
};
