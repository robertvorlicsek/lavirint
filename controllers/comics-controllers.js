const HttpError = require('../models/http-error');
const Comic = require('../models/comics');
const uuid = require('uuid').v4;
const fileUpload = require('../middleware/file-upload');

const getAllEditions = async (req, res, next) => {
  // const editionId = req.params.editionId;
  let edition;
  try {
    // edition = await Comic.find({ editionId });
    edition = await Comic.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find any editions',
      500
    );
    return next(error);
  }

  if (!edition || edition.length === 0) {
    const error = new HttpError('Could not find any comics!', 404);
    return next(error);
  }
  console.log(
    '🚀 ~ file: comics-controllers.js ~ line 19 ~ getAllEditions ~ edition',
    edition
  );

  res.json({
    editions: edition.map(comic => comic.toObject({ getters: true })),
  });
};

const createComic = async (req, res, next) => {
  const { editionId, title, nr, logo } = req.body;

  const newEditionId = uuid();

  // console.log(editionId, title, nr, img, logo);

  const newComic = new Comic({
    editionId: editionId || newEditionId,
    title,
    nr,
    img: 'img',
    logo,
  });

  console.log('new-comic:', newComic);

  // try {
  //   await newComic.save();
  // } catch (err) {
  //   const error = new HttpError('Creating comic failed, please try again', 500);
  //   return next(error);
  // }

  // res.status(201).json({ comic: newComic });
};

exports.getAllEditions = getAllEditions;
exports.createComic = createComic;
