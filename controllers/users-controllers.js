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
    const error = new HttpError('login failed!', 500);
    return next(error);
  }

  if (!existingUser) {
    return next(
      new HttpError('You credentials are incorrect, please try again', 403)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    return next(
      new HttpError('You credentials are incorrect, please try again', 401)
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
    const error = new HttpError('Logging in failed, please try again', 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    username: existingUser.username,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
