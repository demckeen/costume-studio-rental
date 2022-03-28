
// TODO: Update Rentals schema
/**
 * Schemas and routes for admin
 * 
 * Define a schema for Rentals
 * @swagger
 * components:
 *  schemas:
 *      Rentals:
 *          type: object
 *          required:
 *              -rentalId
 *              -rentalDate
 *              -userId
 *              -rentals
 *              -returnDate
 *          properties:
 *              rentalId:
 *                  type: String
 *                  description: The auto-generated id of the rental
 *              rentalDate:
 *                  type: Date
 *                  description: date the rental was placed
 *              userId:
 *                  type: String
 *                  description: id of user who placed the rental
 *              rentals:
 *                  type: Array
 *                  description: list of rentals in rental
 *              returnDate:
 *                  type: Date
 *                  description: date the rental is due
 *          example:
 *              rentalId: 4367489
 *              rentalDate: 10/31/2022
 *              userId: 4326
 *              rentals: [Gandalf the Grey, Tin Man, Queen Elizabeth]
 *              returnDate: 11/31/2022
 *
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 * 
 *  security:
 *   - bearerAuth: []
 *   - _id: []                 
 */

 /**
 * @swagger
 * definitions:
 *      editCostume:
 *          type: object
 *          required:
 *              -category
 *              -costumeId
 *              -costumeName
 *              -rentalFee
 *              -size
 *              -imageUrl
 *              -description
 *          properties:
 *              category:
 *                  type: string
 *              costumeId:
 *                  type: string
 *              costumeName:
 *                  type: string
 *              rentalFee:
 *                  type: number
 *              size:
 *                  type: string
 *              imageUrl:
 *                  type: string
 *              description:
 *                  type: string                
 */

/**
 * @swagger
 * tags:
 *  name: Admin
 *  description: The Admin managing api
 * 
 */

/**
 * POST routes
 * @swagger
 * 
 * /admin/add-costume:
 *      post:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Create a new costume entry in database
 *          tags: [Admin]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                         $ref: '#/definitions/Costume'
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
 */

/**
 * PUT routes
 * @swagger
 * 
 * /admin/edit-costume:
 *      put:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Edit details of existing costume that the user has created
 *          tags: [Admin]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/editCostume'
 *          responses:
 *              200:
 *                  description: The costume was successfully changed
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Costume'
 *              500:
 *                  description: There was a server error
 */

/**
 * DELETE routes
 * @swagger
 * 
 * /admin/delete-costume/{costumeId}:
 *      delete:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Delete costume that admin has created by id
 *          tags: [Admin]
 *          parameters:
 *            - in: path
 *              name: costumeId
 *              schema:
 *                  type: string
 *              required: true
 *              description: This is the costume id
 *          responses:
 *              204:
 *                  description: Deleted
 *              404:
 *                  description: id not found
 *              403:
 *                  description: Unauthorized
 *              500:
 *                  description: there was a server error
 * 
 */