const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const comicsControllers = require('../controllers/promo-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

router.get('/', comicsControllers.getPromos);

router.use(checkAuth);

router.post(
  '/newpromo',
  // fileUpload.single('img'),
  fileUpload.fields([{ name: 'promoImg', maxCount: 1 }]),
  [
    check('promoName').not().isEmpty(),
    check('nr').not().isEmpty(),
    check('promoTitle').not().isEmpty(),
    check('promoText').not().isEmpty(),
  ],
  comicsControllers.createPromo
);
router.patch(
  '/:pid',
  // fileUpload.single('img'),
  fileUpload.fields([{ name: 'promoImg', maxCount: 1 }]),
  [
    check('promoName').not().isEmpty(),
    check('nr').not().isEmpty(),
    check('promoTitle').not().isEmpty(),
    check('promoText').not().isEmpty(),
  ],
  comicsControllers.updatePromo
);
router.delete('/:id', comicsControllers.deletePromo);

module.exports = router;
