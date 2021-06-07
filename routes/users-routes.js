const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const usersControllers = require('../controllers/users-controllers');

router.get('/', usersControllers.getUsers);

router.post(
  '/signup',
  [check('username').not().isEmpty(), check('password').isLength({ min: 12 })],
  usersControllers.signup
);

router.post('/login', usersControllers.login);

router.use(checkAuth);
//new with token switch
router.get('/gettoken', usersControllers.getNewToken);

module.exports = router;
