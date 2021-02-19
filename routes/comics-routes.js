const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const comicsControllers = require('../controllers/comics-controllers');
const fileUpload = require('../middleware/file-upload');

router.get('/', comicsControllers.getAllEditions);
router.get('/comic/:editionId', comicsControllers.getComicsByEditionId);
router.post(
  '/newcomic',
  // fileUpload.single('img'),
  fileUpload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]),
  [check('title').not().isEmpty(), check('nr').not().isEmpty()],
  comicsControllers.createComic
);
router.delete('/:id', comicsControllers.deleteComic);

module.exports = router;
