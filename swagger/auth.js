/**
 * Schemas and routes for auth
 * 
 * Define a schema for users
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              -userId
 *              -name
 *              -email
 *              -password
 *          properties:
 *              userId:
 *                  type: string
 *                  description: The auto-generated id of the user
 *              name:
 *                  type: string
 *                  description: The user's name
 *              email:
 *                  type: string
 *                  description: The user's email address
 *              password:
 *                  type: string
 *                  description: The user's password
 * 
 *              cart:
 *                  items:
 *                      costumeId:
 *                          type: Schema.Types.ObjectId
 *                          ref: 'Costume'
 *                          required: true
 *                      quantity:
 *                          type: Number
 *                          required: true                  
 * 
 *          example:
 *              userId: <auto-generated>
 *              name: John Smith
 *              email: johnsmith@email.com
 *              password: thegreatjohnsmith
 *              cart: 
 *                items:
 *                    costumeId: "abc123"
 *                    quantity: 1        
 *                  
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 * 
 * security:
 *  - bearerAuth: []                 
 */

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: The authorization managing api
 * 
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
 *              201:
 *                  description: The user was successfully signed up
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              500:
 *                  description: There was a server error
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
 *                  description: Login was successful
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
 *                          $ref: '#/components/schemas/User'
 *          responses:
 *              200:
 *                  description: The password was reset
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              500:
 *                  description: There was a server error
 *  
 * /auth/new-password:
 *      post:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Set new password
 *          tags: [Auth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          responses:
 *              200:
 *                  description: New password has been set
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'
 *              500:
 *                  description: There was a server error
 */