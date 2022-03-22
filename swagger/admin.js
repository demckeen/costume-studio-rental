/**
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
 * /admin/costumes:
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
 * /admin/edit-costume/{costumeId}:
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
 * /admin/edit-costume:
 *      post:
 *          summary: Edit details of existing costume that the user has created
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
 * /admin/add-costume:
 *      post:
 *          summary: Create a new costume entry in database
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
 */

/**
 * DELETE routes
 * @swagger
 * 
 * /admin/delete-costume/{costumeId}:
 *      delete:
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