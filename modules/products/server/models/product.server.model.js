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
  startsAt: {
    type: Date,
    default: Date.now
  },
  endsAt: {
    type: Date,
    required: 'Please specify end date for auction'
  },
  startingBid: {
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
  bidHistory: [{
    type: Schema.ObjectId,
    ref: 'Bid'
  }],
  quantity: {
    type: Number,
    required: 'Please enter number of items'
  },
  category: {
    type: String,
    default: '',
    required: 'Please specify the categories as comma seperated values',
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  sold: {
    type: Boolean,
    default: false
  },
  paid: {
    type: Boolean,
    default: false
  },
  canceled: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true,
    default: 'No description available.'
  }
});

mongoose.model('Product', ProductSchema);
