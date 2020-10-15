const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
})

module.exports = mongoos.model('Feature', featureSchema)