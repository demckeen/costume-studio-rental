const express = require('express');
const {body, check} = require('express-validator');
 
const authController = require('../controllers/auth');

const router = express.Router();

/**
 * Define a schema for users
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              -id
 *              -firstName
 *              -lastName
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the user
 *              firstName:
 *                  type: string
 *                  description: The user's first name
 *              lastName:
 *                  type: string
 *                  description: The user's last name
 *          example:
 *              id: 87686587
 *              firstName: John
 *              lastName: Smith          
 *                  
 *          
 */

//Place routes here


module.exports = router;