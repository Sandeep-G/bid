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
<<<<<<< HEAD
=======
  category: {
    type: String,
    default: '',
    required: 'Please specify the categories as comma seperated values',
    trim: true
  },
>>>>>>> d1b9680a108fe0ffa7ff242c5d4d8ab7de72592b
  location: {
    type: String,
    trim: true
  }
});

mongoose.model('Product', ProductSchema);
