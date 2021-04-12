const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const comicsControllers = require('../controllers/comics-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

router.get('/', comicsControllers.getAllComics);
router.get('/editions/:editionId', comicsControllers.getComicsByEditionId);
router.get('/:comicId', comicsControllers.getComicByComicId);

// router.use(checkAuth);

router.post(
  '/newcomic',
  // fileUpload.single('img'),
  fileUpload.fields([
    { name: 'imgs', maxCount: 3 },
    { name: 'logo', maxCount: 1 },
  ]),
  [check('title').not().isEmpty(), check('nr').not().isEmpty()],
  comicsControllers.createComic
);
router.delete('/:id', comicsControllers.deleteComic);

module.exports = router;
