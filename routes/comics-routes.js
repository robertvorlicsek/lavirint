const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const comicsControllers = require('../controllers/comics-controllers');
const fileUpload = require('../middleware/file-upload');

router.get('/', comicsControllers.getAllEditions);
// router.get('/:editionsId/:id', comicsControllers.getComicById);
router.post(
  '/newcomic',
  fileUpload.single('img'),
  [
    check('editionId').not().isEmpty(),
    check('title').not().isEmpty(),
    check('nr').not().isEmpty(),
  ],
  comicsControllers.createComic
);

module.exports = router;
