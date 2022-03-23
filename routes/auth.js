// AUTH ROUTES

const express = require('express');
const {
  body,
  check
} = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const isPassAuth = require('../middleware/is-pass-auth');

const router = express.Router();

// ---PUT Routes---

//
router.put('/signup',
  [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, {
      req
    }) => {
      return User.findOne({
        email: value
      }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('E-mail address already exists!');
        }
      });
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({
      min: 5
    }),
    body('name')
    .trim()
    .not()
    .isEmpty()
  ],
  authController.signup
);


// ---POST Routes---

//
router.post('/login',
  [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
    body('password', 'Password must be valid')
    .isLength({
      min: 5
    })
    .isAlphanumeric()
    .trim()
  ],
  authController.login);

//
router.post('/reset', isPassAuth, authController.postReset);

//
router.post('/reset/:token', authController.isPassLinkAuth);

//
router.post('/new-password', isPassAuth, authController.postNewPassword);

module.exports = router;