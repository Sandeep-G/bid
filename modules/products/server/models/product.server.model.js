'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },
  seller: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  imageURL: {
    type: String,
    default: 'modules/products/client/img/products/default.png'
  },
  startBid: {
    type: Number,
    required: 'Please enter starting bid'
  },
  bidIncrement: {
    type: Number,
    required: 'Please enter minimum bid increment'
  },
  currentBid: {
    type: Schema.ObjectId,
    ref: 'Bid'
  },
  bidHistory: [{type: Schema.ObjectId, ref: 'Bid'}],
  quantity: {
    type: Number,
    required: 'Please enter number of items'
  },
  location: {
    type: String,
    trim: true
  }
});

mongoose.model('Product', ProductSchema);
