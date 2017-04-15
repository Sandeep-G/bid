'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bid Schema
 */
var BidSchema = new Schema({
  bidder: {
    type: Schema.ObjectId,
    ref: 'User',
    required: 'Please specify bidder'
  },
  amount: {
    type: Number,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Bid', BidSchema);
