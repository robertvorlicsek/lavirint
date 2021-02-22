const HttpError = require('../models/http-error');
const Comic = require('../models/comics');
const cloudinaryUtil = require('../utilities/cloudinaryUtil');
const uuid = require('uuid').v4;

const getAllEditions = async (req, res, next) => {
  // const editionId = req.params.editionId;
  let edition;
  try {
    // edition = await Comic.find({ editionId });
    edition = await Comic.find().sort('nr');
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

  res.json({
    editions: edition.map(comic => comic.toObject({ getters: true })),
  });
};

const getComicsByEditionId = async (req, res, next) => {
  const editionId = req.params.editionId;
  let edition;
  try {
    edition = await Comic.find({ editionId }).sort('nr');
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
  const { editionId, title, nr } = req.body;

  const newEditionId = uuid();

  let newImg;
  try {
    newImg = await cloudinaryUtil.cloudinaryUpload(req.files['img'][0].path);
  } catch (err) {
    const error = new HttpError(
      'Could not upload image, please try again',
      500
    );
    return next(error);
  }

  const newComic = new Comic({
    editionId: editionId || newEditionId,
    title,
    nr,
    img: await newImg.url,
    cloudinaryImgId: await newImg.public_id,
  });

  if (req.body.logo) {
    newComic.logo = req.body.logo;
    newComic.cloudinaryLogoId = req.body.cloudinaryLogoId;
  } else if (req.files['logo']) {
    let newLogo;
    try {
      newLogo = await cloudinaryUtil.cloudinaryUpload(
        req.files['logo'][0].path
      );
    } catch (err) {
      const error = new HttpError(
        'Could not upload image, please try again',
        500
      );
      return next(error);
    }

    newComic.logo = await newLogo.url;
    newComic.cloudinaryLogoId = await newLogo.public_id;
  }

  console.log('new-comic:', newComic);
  if (newComic.img && newComic.logo) {
    try {
      await newComic.save();
    } catch (err) {
      const error = new HttpError(
        'Creating comic failed, please try again',
        500
      );
      return next(error);
    }

    res.status(201).json({ message: 'Strip je postavljen!' });
  }
};

const deleteComic = async (req, res, next) => {
  const id = req.params.id;
  let comic;
  try {
    comic = await Comic.findById(id);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete comic',
      500
    );
    return next(error);
  }

  let logoDelete;
  try {
    logoDelete = await Comic.find({ logo: comic.logo });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete comic',
      500
    );
    return next(error);
  }

  try {
    await Comic.findByIdAndDelete(id);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete comic',
      500
    );
    return next(error);
  }

  if (logoDelete.length === 1) {
    try {
      await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryImgId);
      await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryLogoId);
    } catch (err) {
      const error = new HttpError(
        'Could not delete image or logo, please try again',
        500
      );
      return next(error);
    }
  } else {
    try {
      await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryImgId);
    } catch (err) {
      const error = new HttpError(
        'Could not felete image, please try again',
        500
      );
      return next(error);
    }
  }

  res.status(200).json({ message: 'Strip je obrisan!' });
};

exports.getAllEditions = getAllEditions;
exports.getComicsByEditionId = getComicsByEditionId;
exports.createComic = createComic;
exports.deleteComic = deleteComic;
