'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Buying Schema
 */
var BuyingSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: 'Invalid User ID',
    unique: true
  },
  products: {
    type: [{ type: Schema.ObjectId, ref: 'Product', unique: true }],
    default: []
  }
});

mongoose.model('Buying', BuyingSchema);
