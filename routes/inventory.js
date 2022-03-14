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
 *              -costumeId
 *              -category
 *              -costumeName
 *              -rentalFee
 *              -size
 *              -image
 *              -description
 *          properties:
 *              costumeId:
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
 *              costumeId: 43256
 *              category: Fantasy
 *              costumeName: Gandalf the Grey
 *              rentalFee: 50.00
 *              size: Adult Medium
 *              image: https://images.unsplash.com/photo-1515599985634-73dc308d766f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80
 *              description: Summon your inner wizard with this realistic version of Gandalf's Costume.         
 *                  
 *          
 */

/**
 * @swagger
 * tags:
 *  name: Shop
 *  description: The shop managing api
 * 
 */

/**
 * GET routes
 * @swagger
 * 
 * /costumes:
 *      get:
 *          summary: Gets a list of all the costumes
 *          tags: [Shop]
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
 * /costumes/{costumeId}:
 *      get:
 *          summary: Gets the details of the costume with the id
 *          tags: [Shop]
 *          parameters:
 *            - in: path
 *              name: costumeId
 *              schema:
 *                  type: string
 *              required: true
 *              description: This is the costume id
 *          responses:
 *              200:
 *                  description: Get costume information by Id
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Costume'
 *              404:
 *                  description: The costume was not found
 * 
 * /cart:
 *      get:
 *          summary: Get the user's cart information for added costumes currently in the cart
 *          tags: [Shop]
 *          responses:
 *              200:
 *                  description: Get information about cart contents
 *                  content:
 *                      application/json:
 *                          schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Costume'
 * 
 * /rental/{rentalId}:
 *      get:
 *          summary: Gets the details of the rental with the rental id
 *          tags: [Shop]
 *          parameters:
 *            - in: path
 *              name: rentalId
 *              schema:
 *                  type: string
 *              required: true
 *              description: This is the rental id
 *          responses:
 *              200:
 *                  description: Get rental information for a single past rental order
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Rental'
 *              404:
 *                  description: The rental was not found
 * 
 * /rentals:
 *      get:
 *          summary: Gets all rentals for a single user
 *          tags: [Shop]
 *          responses:
 *              200:
 *                  description: Get list of rentals
 *                  content:
 *                      application/json:
 *                          schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Rental'
 * 
 * 
 * 
 * 
 * 
 */

/**
 * POST routes
 * @swagger
 * 
 * /cart:
 *      post:
 *          summary: add costume to cart for potential rental
 *          tags: [Shop]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Costume'
 *          responses:
 *              200:
 *                  description: The costume was successfully added to the cart
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Costume'
 *              500:
 *                  description: There was a server error
 * 
 * /cart-delete-item:
 *      post:
 *          summary: remove costume from cart
 *          tags: [Shop]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Costume'
 *          responses:
 *              200:
 *                  description: The costume was successfully deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Costume'
 *              500:
 *                  description: There was a server error
 * 
 * /create-rental:
 *      post:
 *          summary: submit costumes and create rental order
 *          tags: [Shop]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Rental'
 *          responses:
 *              200:
 *                  description: The tental was successfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Rental'
 *              500:
 *                  description: There was a server error
 * 
 * /cancel-rental:
 *      post:
 *          summary: submit cancellation request for rental that has not yet begun
 *          tags: [Shop]
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