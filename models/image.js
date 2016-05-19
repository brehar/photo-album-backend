'use strict';

var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    }
});

var Image = mongoose.model('Image', imageSchema);

module.exports = Image;