'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Buyings Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'user'],
    allows: [{
      resources: '/api/buyings/listWinning',
      permissions: '*'
    }, {
      resources: '/api/buyings/listLosing',
      permissions: '*'
    }, {
      resources: '/api/buyings/listWon',
      permissions: '*'
    }, {
      resources: '/api/buyings/listPurchased',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: []
  }]);
};

/**
 * Check If Buyings Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Buying is being processed and the current user created it then allow any manipulation
  if (req.buying && req.user && req.buying.user && req.buying.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
