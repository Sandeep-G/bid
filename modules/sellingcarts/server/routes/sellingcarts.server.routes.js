'use strict';

/**
 * Module dependencies
 */
var sellingcartsPolicy = require('../policies/sellingcarts.server.policy'),
  sellingcarts = require('../controllers/sellingcarts.server.controller');

module.exports = function(app) {
  // Sellingcarts Routes
  app.route('/api/sellingcarts').all(sellingcartsPolicy.isAllowed)
    .get(sellingcarts.list)
    .post(sellingcarts.create);

  app.route('/api/sellingcarts/:sellingcartId').all(sellingcartsPolicy.isAllowed)
    .get(sellingcarts.read)
    .put(sellingcarts.update)
    .delete(sellingcarts.delete);

  // Finish by binding the Sellingcart middleware
  app.param('sellingcartId', sellingcarts.sellingcartByID);
};
