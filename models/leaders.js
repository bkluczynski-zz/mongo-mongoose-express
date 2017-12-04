const mongoose = require('mongoose');

const { Schema } = mongoose;
require('mongoose-currency').loadType(mongoose);

const { Currency } = mongoose.Types;

const leaderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  descripton: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  price: {
    type: Currency,
    required: true,
    min: 0,
  },
});

const Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;
