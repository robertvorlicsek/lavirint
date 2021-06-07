const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Could not fetch any users, please try again later',
      500
    );
    return next(error);
  }

  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input passed, please check your data.', 422)
    );
  }
  const { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError(
      'Could not verify if user name already exists, signup failed!',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    username,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again', 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, username: createdUser.username },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again', 500);
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    username: createdUser.username,
    token: token,
    message: 'Login uspešan!',
  });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError('Login nije uspeo!', 500);
    return next(error);
  }

  if (!existingUser) {
    return next(
      new HttpError('Pogrešan username ili pass, pokušaj ponovo!', 403)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Login nije uspeo, proveri username ili pass i pokušaj ponovo!',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    return next(
      new HttpError('Pogrešan username ili pass, pokušaj ponovo!', 401)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, username: existingUser.username },
      process.env.JWT_KEY,
      { expiresIn: '2h' }
    );
  } catch (err) {
    const error = new HttpError('Login nije uspeo, pokušaj ponovo!', 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    username: existingUser.username,
    token: token,
  });
};

// new with token switch
const getNewToken = async (req, res, next) => {
  let token;
  try {
    token = req.headers.authorization.split(' ')[1];
    console.log('old token: ', token);
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    console.log(decodedToken.userId, decodedToken.username);
    token = jwt.sign(
      { userId: decodedToken.userId, username: decodedToken.username },
      process.env.JWT_KEY,
      { expiresIn: '2h' }
    );
    console.log('new token: ', token);
    res.json({
      userId: decodedToken.userId,
      username: decodedToken.username,
      token: token,
    });
  } catch (err) {
    const error = new HttpError('Header Bearer authentication failed!', 401);
    return next(error);
  }
};
// new with token switch
exports.getNewToken = getNewToken;

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
