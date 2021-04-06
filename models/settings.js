const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const settingsSchema = new Schema({
  nrOfPromos: {
    type: Number,
    required: true,
  },
  backgroundImgs: {
    type: Array,
  },
  cloudinaryBackgroundImgIds: {
    type: Array,
  },
  menuBackgroundImgs: {
    type: Array,
  },
  cloudinaryMenuBackgroundImgIds: {
    type: Array,
  },
});

// comicSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Settings', settingsSchema);
