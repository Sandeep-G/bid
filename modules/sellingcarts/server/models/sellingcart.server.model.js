'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sellingcart Schema
 */
var SellingcartSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Sellingcart name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Sellingcart', SellingcartSchema);
