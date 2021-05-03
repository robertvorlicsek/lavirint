const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const comicSchema = new Schema({
  editionId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  nr: {
    type: Number,
    required: true,
  },
  imgs: {
    type: Array,
    required: true,
  },
  logo: {
    type: String,
  },
  cloudinaryLogoId: {
    type: String,
  },
  cloudinaryImgIds: {
    type: Array,
  },
  info: {
    comicYear: {
      type: String,
    },
    comicSeries: {
      type: String,
    },
    comicWriter: {
      type: String,
    },
    comicArtist: {
      type: String,
    },
    comicTitleArtist: {
      type: String,
    },
    comicOriginalTitle: {
      type: String,
    },
    comicOriginalNr: {
      type: String,
    },
    comicOriginCountry: {
      type: String,
    },
    comicDimensions: {
      type: String,
    },
    comicFinish: {
      type: String,
    },
    comicPageNr: {
      type: String,
    },
    comicColor: {
      type: String,
    },
    comicPreview: {
      type: String,
    },
  },
});

// comicSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Comic', comicSchema);
