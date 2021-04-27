const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const settingsSchema = new Schema({
  nrOfPromos: {
    type: Number,
    required: true,
  },
  textColor: {
    r: {
      type: Number,
    },
    g: {
      type: Number,
    },
    b: {
      type: Number,
    },
    a: {
      type: Number,
    },
  },
  backgroundColor: {
    r: {
      type: Number,
    },
    g: {
      type: Number,
    },
    b: {
      type: Number,
    },
    a: {
      type: Number,
    },
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
