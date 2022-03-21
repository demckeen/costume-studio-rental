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
 *              -password
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
 *              password:
 *                  type: string
 *                  description: The user's password
 *          example:
 *              userId: 87686587
 *              name: John
 *              lastName: Smith
 *              email: johnsmith@email.com
 *              password: thegreatjohnsmith          
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
 * /auth/login:
 *      post:
 *          summary: Submit user email and password to authenicate and log in
 *          tags: [Auth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          responses:
 *              200:
 *                  description: Login was successfull
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              500:
 *                  description: There was a server error
 * 
 * /auth/logout:
 *      post:
 *          summary: Logout
 *          tags: [Auth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          responses:
 *              200:
 *                  description: Logout was successful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              500:
 *                  description: There was a server error
 * 
 * /auth/reset:
 *      post:
 *          summary: Reset password
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
 * /auth/reset/{token}:
 *      post:
 *          summary: Reset password
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
 * /auth/new-password:
 *      post:
 *          summary: Set new password
 *          tags: [Auth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Rental'
 *          responses:
 *              200:
 *                  description: New password has been set
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
 * /auth/signup:
 *      put:
 *          summary: Create account with a user's name, email, and password
 *          tags: [Auth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          responses:
 *              200:
 *                  description: The user was successfully signed up
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              500:
 *                  description: There was a server error
 */