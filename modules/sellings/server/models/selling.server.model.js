'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Selling Schema
 */
var SellingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Selling name',
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

mongoose.model('Selling', SellingSchema);
