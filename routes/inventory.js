const express = require('express');
const {
    body,
    check
} = require('express-validator');

const inventoryController = require('../controllers/inventory');

const router = express.Router();


/**
 * Define a schema for inventory
 * @swagger
 * components:
 *  schemas:
 *      Costume:
 *          type: object
 *          required:
 *              -category
 *              -costumeName
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the costume
 *              category:
 *                  type: string
 *                  description: The costume category
 *              costumeName:
 *                  type: string
 *                  description: The costume name
 *          example:
 *              id: 43256
 *              category: Fantasy
 *              costumeName: Gandalf the Grey          
 *                  
 *          
 */

/**
 * routes to show on api contract
 * @swagger
 *  /costumes:
 *      get:
 *          summary: Returns a list of all the costumes
 *          responses:
 *              200:
 *                  description: The list of costumes
 *                  content:
 *                      application/json:
 *                          schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Costume'
 */

//Place routes here


module.exports = router;