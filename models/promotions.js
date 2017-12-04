const mongoose = require('mongoose');

const { Schema } = mongoose;

const promotionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  abbr: {
    type: String,
    required: true,
  },
  descripton: {
    type: String,
    required: true,
  },
  featured: {
    type: String,
    required: true,
  },
});

const Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;
