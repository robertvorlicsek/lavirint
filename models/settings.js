const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const settingsSchema = new Schema({
  nrOfPromos: {
    type: Number,
    required: true,
  },

  backgroundImg: {
    type: String,
    required: true,
  },
  cloudinaryBackgroundImgId: {
    type: String,
  },
});

// comicSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Settings', settingsSchema);
