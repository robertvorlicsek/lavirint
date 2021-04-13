const HttpError = require('../models/http-error');
const Comic = require('../models/comics');
const cloudinaryUtil = require('../utilities/cloudinaryUtil');
const uuid = require('uuid').v4;

const getAllComics = async (req, res, next) => {
  // const editionId = req.params.editionId;
  let comics;
  try {
    // edition = await Comic.find({ editionId });
    comics = await Comic.find().sort('nr');
  } catch (err) {
    const error = new HttpError(
      'Nešto je zapelo, nijedan strip nije pronađen!',
      500
    );
    return next(error);
  }

  if (!comics || comics.length === 0) {
    const error = new HttpError('Ovo izdanje ne postoji!', 404);
    return next(error);
  }

  res.json({
    comics: comics.map(comic => comic.toObject({ getters: true })),
  });
};

const getComicByComicId = async (req, res, next) => {
  const comicId = req.params.comicId;
  let comic;
  try {
    comic = await Comic.findById(comicId);
  } catch (err) {
    const error = new HttpError('Ovaj strip nije pronađen!', 500);
    return next(error);
  }

  if (!comic) {
    const error = new HttpError('Ova strip ne postoji!', 404);
    return next(error);
  }

  res.json({
    comic: comic.toObject({ getters: true }),
  });
};

const getComicsByEditionId = async (req, res, next) => {
  const editionId = req.params.editionId;
  let edition;
  try {
    edition = await Comic.find({ editionId }).sort('nr');
  } catch (err) {
    const error = new HttpError('Nijedna edicija nije pronađena!', 500);
    return next(error);
  }

  if (!edition || edition.length === 0) {
    const error = new HttpError('Ova edicija (više) ne postoji!', 404);
    return next(error);
  }

  res.json({
    editions: edition.map(comic => comic.toObject({ getters: true })),
  });
};

const createComic = async (req, res, next) => {
  const { editionId, title, nr } = req.body;

  const newEditionId = uuid();

  // console.log('images: ', req.files['imgs'][0]);

  let newImgArr;
  let url0;
  let url1;
  let url2;
  let info;

  if (req.body.info) {
    console.log(
      '🚀 ~ file: comics-controllers.js ~ line 84 ~ createComic ~ req.body.info',
      req.body.info
    );
    info = JSON.parse(req.body.info);
    // info = req.body.info;
  }

  if (req.files) {
    console.log(req.files);
    try {
      url0 = await cloudinaryUtil.cloudinaryUpload(req.files['imgs'][0].path);
      url1 = await cloudinaryUtil.cloudinaryUpload(req.files['imgs'][1].path);
      url2 = await cloudinaryUtil.cloudinaryUpload(req.files['imgs'][2].path);
    } catch (err) {
      const error = new HttpError(
        'Upload strana nije uspeo, probaj ponovo!',
        500
      );
      return next(error);
    }
  }

  if (url0 && url1 && url2) newImgArr = [url0, url1, url2];

  const newComic = new Comic({
    editionId: editionId || newEditionId,
    title,
    nr,
    imgs: newImgArr.map(img => img.secure_url),
    cloudinaryImgIds: newImgArr.map(img => img.public_id),
    info,
  });

  // console.log('newComic: ', newComic);

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
        'Upload slike nije uspeo, probaj ponovo!',
        500
      );
      return next(error);
    }

    newComic.logo = await newLogo.secure_url;
    newComic.cloudinaryLogoId = await newLogo.public_id;
  }

  // console.log('newComic with cloudinary: ', newComic);

  if (newComic.imgs && newComic.logo) {
    try {
      await newComic.save();
    } catch (err) {
      const error = new HttpError(
        'Postavljanje stripa nije uspelo, probaj ponovo!',
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
      'Nešto je zapelo, strip nije obrisan, probaj ponovo!',
      500
    );
    return next(error);
  }

  let logoDelete;
  try {
    logoDelete = await Comic.find({ logo: comic.logo });
  } catch (err) {
    const error = new HttpError(
      'Nešto je zapelo, strip nije obrisan, probaj ponovo!',
      500
    );
    return next(error);
  }

  try {
    await Comic.findByIdAndDelete(id);
  } catch (err) {
    const error = new HttpError(
      'Nešto je zapelo, strip nije obrisan, probaj ponovo!',
      500
    );
    return next(error);
  }

  if (logoDelete.length === 1) {
    try {
      await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryImgIds[0]);
      await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryImgIds[1]);
      await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryImgIds[2]);
      await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryLogoId);
    } catch (err) {
      const error = new HttpError(
        'Preview stranice stripa ili logo nisu obrisani, probaj ponovo!',
        500
      );
      return next(error);
    }
  } else {
    try {
      await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryImgIds[0]);
      await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryImgIds[1]);
      await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryImgIds[2]);
    } catch (err) {
      const error = new HttpError(
        'Preview stranice stripa nisu obrisane, probaj još jednom kasnije!',
        500
      );
      return next(error);
    }
  }

  res.status(200).json({ message: 'Strip je obrisan!' });
};

exports.getAllComics = getAllComics;
exports.getComicsByEditionId = getComicsByEditionId;
exports.getComicByComicId = getComicByComicId;
exports.createComic = createComic;
exports.deleteComic = deleteComic;
