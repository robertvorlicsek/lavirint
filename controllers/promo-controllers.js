const HttpError = require('../models/http-error');
const Promo = require('../models/promo');
const cloudinaryUtil = require('../utilities/cloudinaryUtil');
// const uuid = require('uuid').v4;

const getPromos = async (req, res, next) => {
  let promos;
  try {
    promos = await Promo.find().sort('nr');
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
  const { promoName, promoTitle, promoText, nr } = req.body;

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
    promoName,
    nr,
    promoTitle,
    promoText,
    promoImg: await newPromoImg.url,
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

// const deleteComic = async (req, res, next) => {
//   const id = req.params.id;
//   let comic;
//   try {
//     comic = await Comic.findById(id);
//   } catch (err) {
//     const error = new HttpError(
//       'Nešto je zapelo, strip nije obrisan, probaj ponovo!',
//       500
//     );
//     return next(error);
//   }

//   let logoDelete;
//   try {
//     logoDelete = await Comic.find({ logo: comic.logo });
//   } catch (err) {
//     const error = new HttpError(
//       'Nešto je zapelo, strip nije obrisan, probaj ponovo!',
//       500
//     );
//     return next(error);
//   }

//   try {
//     await Comic.findByIdAndDelete(id);
//   } catch (err) {
//     const error = new HttpError(
//       'Nešto je zapelo, strip nije obrisan, probaj ponovo!',
//       500
//     );
//     return next(error);
//   }

//   if (logoDelete.length === 1) {
//     try {
//       await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryImgId);
//       await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryLogoId);
//     } catch (err) {
//       const error = new HttpError(
//         'Naslovnica ili logo nisu obrisani, probaj ponovo!',
//         500
//       );
//       return next(error);
//     }
//   } else {
//     try {
//       await cloudinaryUtil.cloudinaryDelete(comic.cloudinaryImgId);
//     } catch (err) {
//       const error = new HttpError(
//         'Naslovnica nije obrisana, probaj još jednom kasnije!',
//         500
//       );
//       return next(error);
//     }
//   }

//   res.status(200).json({ message: 'Strip je obrisan!' });
// };

exports.getPromos = getPromos;
exports.createPromo = createPromo;
// exports.deletePromo = deletePromo;
