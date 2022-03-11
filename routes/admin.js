const express = require('express');
const {body, check} = require('express-validator');
 
const adminController = require('../controllers/admin');

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
 *              -rentalFee
 *              -size
 *              -image
 *              -description
 *          properties:
 *              id:
 *                  type: String
 *                  description: The auto-generated id of the costume
 *              category:
 *                  type: String
 *                  description: The costume category
 *              costumeName:
 *                  type: String
 *                  description: The costume name
 *              rentalFee:
 *                  type: Number
 *                  description: The fee for costume rental
 *              size:
 *                  type: String
 *                  description: The costume size
 *              image:
 *                  type: String
 *                  description: The image URL
 *              description:
 *                  type: String
 *                  description: The costume description
 *          example:
 *              id: 43256
 *              category: Fantasy
 *              costumeName: Gandalf the Grey
 *              rentalFee: 50.00
 *              size: Adult Medium
 *              image: https://unsplash.com/photos/jXl5-4pia3U
 *              description: Summon your inner wizard with this realistic version of Gandalf's Costume.         
 *                  
 *          
 */

/**
 * @swagger
 * tags:
 *  name: Admin
 *  description: The Admin managing api
 * 
 */


/**
 * GET routes
 * @swagger
 * 
 * admin/costumes:
 *      get:
 *          summary: Gets a list of all the costumes
 *          tags: [Admin]
 *          responses:
 *              200:
 *                  description: List of costumes
 *                  content:
 *                      application/json:
 *                          schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Costume'
 * 
 * admin/edit-costume/{costumeId}:
 *      get:
 *          summary: Get single costume detail for logged in user that created that costume
 *          tags: [Admin]
 *          parameters:
 *            - in: path
 *              name: costumeId
 *              schema:
 *                  type: string
 *              required: true
 *              description: This is the costume id
 *          responses:
 *              200:
 *                  description: Get costume information by Id for logged in user
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Costume'
 *              404:
 *                  description: The costume was not found
 * 
 */

/**
 * POST routes
 * @swagger
 * 
 * admin/edit-costume:
 *      post:
 *          summary: edit details of existing costume that the user has created
 *          tags: [Admin]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Costume'
 *          responses:
 *              200:
 *                  description: The costume was successfully changed
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Costume'
 *              500:
 *                  description: There was a server error
 * 
 * admin/add-costume:
 *      post:
 *          summary: create new costume entry in database
 *          tags: [Admin]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Costume'
 *          responses:
 *              200:
 *                  description: The costume was successfully added to the database
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Costume'
 *              500:
 *                  description: There was a server error
 * 
 * admin/delete-costume:
 *      post:
 *          summary: submit costumes and create rental order
 *          tags: [Admin]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Rental'
 *          responses:
 *              200:
 *                  description: The costume was successfully deleted from the database
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Costume'
 *              500:
 *                  description: There was a server error
 * 
 * /cancel-rental:
 *      post:
 *          summary: submit cancellation request for rental that has not yet begun
 *          tags: [Admin]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Rental'
 *          responses:
 *              200:
 *                  description: The cancellation request was successfully submitted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Rental'
 *              500:
 *                  description: There was a server error
 */

//Place routes here


module.exports = router;