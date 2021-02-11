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
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
});

// comicSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Comic', comicSchema);
