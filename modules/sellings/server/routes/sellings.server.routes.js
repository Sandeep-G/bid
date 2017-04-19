'use strict';

/**
 * Module dependencies
 */
var sellingsPolicy = require('../policies/sellings.server.policy'),
  sellings = require('../controllers/sellings.server.controller');

module.exports = function(app) {
  // Sellings Routes
  app.route('/api/sellings/sellItem').all(sellingsPolicy.isAllowed)
    .put(sellings.sellItem);

  app.route('/api/sellings/listActiveItems').all(sellingsPolicy.isAllowed)
    .get(sellings.listActiveItems);

  app.route('/api/sellings/listSoldItems').all(sellingsPolicy.isAllowed)
    .get(sellings.listSoldItems);

  app.route('/api/sellings/listUnsoldItems').all(sellingsPolicy.isAllowed)
    .get(sellings.listUnsoldItems);

  app.route('/api/sellings/listCanceledItems').all(sellingsPolicy.isAllowed)
    .get(sellings.listCanceledItems);

};
