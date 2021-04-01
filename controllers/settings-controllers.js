const HttpError = require('../models/http-error');
const Settings = require('../models/settings');
const cloudinaryUtil = require('../utilities/cloudinaryUtil');

const getSettings = async (req, res, next) => {
  let settings;
  try {
    settings = await Settings.find();
  } catch (err) {
    const error = new HttpError(
      'Nešto je zapelo, podešavanja nisu učitana!',
      500
    );
    return next(error);
  }

  if (!settings || settings.length === 0) {
    const error = new HttpError('Podešavanja ne postoje!', 404);
    return next(error);
  }

  res.json({
    settings: settings[0].toObject({ getters: true }),
  });
};

const createSettings = async (req, res, next) => {
  const { nrOfPromos } = req.body;

  let newBackgroundImg;
  try {
    newBackgroundImg = await cloudinaryUtil.cloudinaryUpload(
      req.files['backgroundImg'][0].path
    );
  } catch (err) {
    const error = new HttpError(
      'Upload backgrounda nije uspeo, probaj ponovo!',
      500
    );
    return next(error);
  }

  const newSettings = new Settings({
    nrOfPromos,
    backgroundImg: await newBackgroundImg.secure_url,
    cloudinaryBackgroundImgId: await newBackgroundImg.public_id,
  });

  if (newSettings.backgroundImg) {
    try {
      await newSettings.save();
    } catch (err) {
      const error = new HttpError(
        'Upload podešavanja nije uspeo, probaj ponovo!',
        500
      );
      return next(error);
    }

    res.status(201).json({ message: 'Podešavanja su primenjena!' });
  }
};

const updateSettings = async (req, res, next) => {
  const {
    nrOfPromos,
    cloudinaryBackgroundImgId,
    cloudinaryMenuBackgroundImgId,
  } = req.body;
  let newCloudinaryBackgroundImgId;
  let newBackgroundImg;
  let newCloudinaryMenuBackgroundImgId;
  let newMenuBackgroundImg;
  let deletedMenuBackground;
  let deletedCloudinaryMenuBackgroundId;

  if (req.body.backgroundImg) {
    newBackgroundImg = req.body.backgroundImg;
    newCloudinaryBackgroundImgId = cloudinaryBackgroundImgId;
  } else if (req.files) {
    try {
      newBackImg = await cloudinaryUtil.cloudinaryUpload(
        req.files['backgroundImg'][0].path
      );
      newBackgroundImg = await newBackImg.secure_url;
      newCloudinaryBackgroundImgId = await newBackImg.public_id;
    } catch (err) {
      const error = new HttpError(
        'Upload novog background-a nije uspeo, probaj ponovo!',
        500
      );
      return next(error);
    }
    if (newCloudinaryBackgroundImgId !== cloudinaryBackgroundImgId) {
      try {
        await cloudinaryUtil.cloudinaryDelete(cloudinaryBackgroundImgId);
      } catch (err) {
        const error = new HttpError(
          'Stari background nije obrisan, probaj kasnije ponovo!',
          500
        );
        return next(error);
      }
    }
  }
  if (req.body.menuBackgroundImg) {
    newMenuBackgroundImg = req.body.menuBackgroundImg;
    newCloudinaryMenuBackgroundImgId = cloudinaryMenuBackgroundImgId;
  } else if (req.files) {
    try {
      newMenuBackImg = await cloudinaryUtil.cloudinaryUpload(
        req.files['menuBackgroundImg'][0].path
      );
      newMenuBackgroundImg = await newMenuBackImg.secure_url;
      newCloudinaryMenuBackgroundImgId = await newMenuBackImg.public_id;
    } catch (err) {
      const error = new HttpError(
        'Upload novog menu-background-a nije uspeo, probaj ponovo!',
        500
      );
      return next(error);
    }
    // if (newMenuCloudinaryBackgroundImgId !== cloudinaryMenuBackgroundImgIds) {
    //   try {
    //     await cloudinaryUtil.cloudinaryDelete(cloudinaryMenuBackgroundImgIds);
    //   } catch (err) {
    //     const error = new HttpError(
    //       'Stari background nije obrisan, probaj kasnije ponovo!',
    //       500
    //     );
    //     return next(error);
    //   }
    // }
  }

  let settings;
  try {
    settings = await Settings.find();
    settings = settings[0];
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place',
      500
    );
    return next(error);
  }

  console.log(settings);

  if (
    req.body.removedCloudinaryMenuBackgroundId &&
    req.body.removedMenuBackground
  ) {
    deletedMenuBackground = req.body.removedMenuBackground;
    deletedCloudinaryMenuBackgroundId =
      req.body.removedCloudinaryMenuBackgroundId;
    console.log('url: ', deletedMenuBackground);
    console.log('id: ', deletedCloudinaryMenuBackgroundId);
    try {
      await cloudinaryUtil.cloudinaryDelete(deletedCloudinaryMenuBackgroundId);
      settings.menuBackgroundImgs = settings.menuBackgroundImgs.filter(
        url => url !== deletedMenuBackground
      );
      settings.cloudinaryMenuBackgroundImgIds = settings.cloudinaryMenuBackgroundImgIds.filter(
        id => id !== deletedCloudinaryMenuBackgroundId
      );
    } catch (err) {
      const error = new HttpError(
        'Odabrani Menu Background nije obrisan, probaj kasnije ponovo!',
        500
      );
      return next(error);
    }
  }

  if (
    settings.cloudinaryMenuBackgroundImgIds.includes(
      newCloudinaryMenuBackgroundImgId
    )
  ) {
    // try {
    //   await cloudinaryUtil.cloudinaryDelete(newCloudinaryMenuBackgroundImgId);
    settings.menuBackgroundImgs = settings.menuBackgroundImgs.filter(
      url => url !== newMenuBackgroundImg
    );
    settings.cloudinaryMenuBackgroundImgIds = settings.cloudinaryMenuBackgroundImgIds.filter(
      id => id !== newCloudinaryMenuBackgroundImgId
    );
    // } catch (err) {
    //   const error = new HttpError(
    //     'Stari background nije obrisan, probaj kasnije ponovo!',
    //     500
    //   );
    //   return next(error);
    // }
  }

  console.log('images array: ', settings.menuBackgroundImgs);

  settings.nrOfPromos = nrOfPromos;
  settings.backgroundImg = newBackgroundImg;
  settings.cloudinaryBackgroundImgId = newCloudinaryBackgroundImgId;
  if (deletedMenuBackground !== newMenuBackgroundImg) {
    settings.menuBackgroundImgs.unshift(newMenuBackgroundImg);
  }
  if (deletedCloudinaryMenuBackgroundId !== newCloudinaryMenuBackgroundImgId) {
    settings.cloudinaryMenuBackgroundImgIds.unshift(
      newCloudinaryMenuBackgroundImgId
    );
  }

  console.log(settings);

  try {
    await settings.save();
  } catch (err) {
    const error = new HttpError(
      'Nešto je zapelo, promene nisu uploadovane!',
      500
    );
    return next(error);
  }
  res.status(201).json({ message: 'Podešavanja su promenjena!' });
};

exports.getSettings = getSettings;
exports.createSettings = createSettings;
exports.updateSettings = updateSettings;
