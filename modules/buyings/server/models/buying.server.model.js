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
  name: {
    type: String,
    default: '',
    required: 'Please fill Buying name',
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

mongoose.model('Buying', BuyingSchema);
