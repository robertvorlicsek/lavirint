const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const promoSchema = new Schema({
  promoName: {
    type: String,
    required: true,
  },
  nr: {
    type: Number,
    required: true,
  },
  promoTitle: {
    type: String,
    required: true,
  },
  promoText: {
    type: String,
    required: true,
  },
  promoImg: {
    type: String,
    required: true,
  },
  cloudinaryPromoImgId: {
    type: String,
  },
});

// comicSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Promo', promoSchema);
