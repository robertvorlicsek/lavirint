const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const settingsControllers = require('../controllers/settings-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

router.get('/', settingsControllers.getSettings);

// router.use(checkAuth);

router.post(
  '/newsettings',
  // fileUpload.single('img'),
  fileUpload.fields([
    { name: 'backgroundImg', maxCount: 1 },
    { name: 'menuBackgroundImg', maxCount: 1 },
  ]),
  [check('nrOfPromos').not().isEmpty()],
  settingsControllers.createSettings
);

router.patch(
  '/',
  [check('nrOfPromos').not().isEmpty()],
  fileUpload.fields([
    { name: 'backgroundImg', maxCount: 1 },
    { name: 'menuBackgroundImg', maxCount: 1 },
  ]),
  settingsControllers.updateSettings
);

module.exports = router;
