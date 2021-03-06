const HttpError = require('../models/http-error');
const Promo = require('../models/promo');
const cloudinaryUtil = require('../utilities/cloudinaryUtil');
// const uuid = require('uuid').v4;

const getPromos = async (req, res, next) => {
  let promos;
  try {
    promos = await Promo.find().sort({ nr: 'desc' });
  } catch (err) {
    const error = new HttpError(
      'Nešto je zapelo, nijedna najava nije pronađena!',
      500
    );
    return next(error);
  }

  if (!promos || promos.length === 0) {
    const error = new HttpError('Najave ne postoje!', 404);
    return next(error);
  }

  console.log(promos);

  res.json({
    promos: promos.map(promo => promo.toObject({ getters: true })),
  });
};

const createPromo = async (req, res, next) => {
  const { promoName, promoTitle, promoText, nr, promoDate } = req.body;

  let newPromoImg;
  try {
    newPromoImg = await cloudinaryUtil.cloudinaryUpload(
      req.files['promoImg'][0].path
    );
  } catch (err) {
    const error = new HttpError(
      'Upload promo slike nije uspeo, probaj ponovo!',
      500
    );
    return next(error);
  }

  const newPromo = new Promo({
    nr,
    promoDate,
    promoTitle,
    promoText,
    promoImg: await newPromoImg.url,
    cloudinaryPromoImgId: await newPromoImg.public_id,
  });

  console.log('new-promo:', newPromo);
  if (newPromo.promoImg) {
    try {
      await newPromo.save();
    } catch (err) {
      const error = new HttpError(
        'Postavljanje najave nije uspelo, probaj ponovo!',
        500
      );
      return next(error);
    }

    res.status(201).json({ message: 'Najava je postavljena!' });
  }
};

const deletePromo = async (req, res, next) => {
  const id = req.params.id;
  let promo;

  try {
    promo = await Promo.findById(id);
  } catch (err) {
    const error = new HttpError(
      'Nešto je zapelo, najava ne postoji, probaj ponovo!',
      500
    );
    return next(error);
  }

  try {
    await Promo.findByIdAndDelete(id);
  } catch (err) {
    const error = new HttpError(
      'Nešto je zapelo, najava nije obrisana, probaj ponovo!',
      500
    );
    return next(error);
  }

  try {
    await cloudinaryUtil.cloudinaryDelete(promo.cloudinaryPromoImgId);
  } catch (err) {
    const error = new HttpError(
      'Slika iz najave nije obrisana, probaj još jednom kasnije!',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Najava je obrisana!' });
};

exports.getPromos = getPromos;
exports.createPromo = createPromo;
exports.deletePromo = deletePromo;
