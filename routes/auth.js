const express = require('express');
const {body, check} = require('express-validator');
 
const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const isPassAuth = require('../middleware/is-pass-auth');

const router = express.Router();

/**
 * Define a schema for users
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              -userId
 *              -firstName
 *              -lastName
 *              -email
 *          properties:
 *              userId:
 *                  type: string
 *                  description: The auto-generated id of the user
 *              firstName:
 *                  type: string
 *                  description: The user's first name
 *              lastName:
 *                  type: string
 *                  description: The user's last name
 *              email:
 *                  type: string
 *                  description: The user's email address
 *          example:
 *              userId: 87686587
 *              firstName: John
 *              lastName: Smith
 *              email: johnsmith@email.com          
 *                  
 *          
 */

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: The authorization managing api
 * 
 */

/**
 * POST routes
 * @swagger
 * 
 * auth/login:
 *      post:
 *          summary: submit user email and password to authenicate and log in
 *          tags: [Auth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          responses:
 *              200:
 *                  description: The costume was successfully added to the cart
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              500:
 *                  description: There was a server error
 * 
 * auth/logout:
 *      post:
 *          summary: ???
 *          tags: [Auth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          responses:
 *              200:
 *                  description: Log out was successful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              500:
 *                  description: There was a server error
 * 
 * auth/reset:
 *      post:
 *          summary: reset password
 *          tags: [Auth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Rental'
 *          responses:
 *              200:
 *                  description: The password was reset
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Rental'
 *              500:
 *                  description: There was a server error
 *  
 * auth/reset/{token}:
 *      post:
 *          summary: reset password
 *          tags: [Auth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Rental'
 *          responses:
 *              200:
 *                  description: The password was reset
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Rental'
 *              500:
 *                  description: There was a server error
 * 
 * auth/new-password:
 *      post:
 *          summary: set new password
 *          tags: [Auth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Rental'
 *          responses:
 *              200:
 *                  description: new password has been set
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Rental'
 *              500:
 *                  description: There was a server error
 */

/**
 * PUT routes
 * @swagger
 * 
 * auth/signup:
 *      put:
 *          summary: create account with a user's name, email, and password
 *          tags: [Auth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          responses:
 *              200:
 *                  description: The costume was successfully deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              500:
 *                  description: There was a server error
 */

//Place routes here
router.put('/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ], 
    authController.signup
);

router.post('/login', 
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password must be valid')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.login);

// commenting out unless we want to handle blacklisting jwt
// router.post('/logout', authController.postLogout);

router.post('/reset', isPassAuth, authController.postReset);

router.post('/reset/:token', authController.isPassLinkAuth);

router.post('/new-password', isPassAuth, authController.postNewPassword);

module.exports = router;