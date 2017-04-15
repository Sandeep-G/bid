'use strict';

/**
 * Module dependencies
 */
var sellingsPolicy = require('../policies/sellings.server.policy'),
  sellings = require('../controllers/sellings.server.controller');

module.exports = function(app) {
  // Sellings Routes
  app.route('/api/sellings').all(sellingsPolicy.isAllowed)
    .get(sellings.list)
    .post(sellings.create);

  app.route('/api/sellings/:sellingId').all(sellingsPolicy.isAllowed)
    .get(sellings.read)
    .put(sellings.update)
    .delete(sellings.delete);

  // Finish by binding the Selling middleware
  app.param('sellingId', sellings.sellingByID);
};
