/**
 * Schemas and routes for costume - includes cart and rentals
 * 
 * Define a schema for costume inventory
 * @swagger
 * 
 * definitions:
 *      Costume:
 *          type: object
 *          required:
 *              -category
 *              -costumeName
 *              -rentalFee
 *              -size
 *              -imageUrl
 *              -description
 *          properties:
 *              category:
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
 * 
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
 *              imageUrl:
 *                  type: String
 *                  description: The image URL
 *              description:
 *                  type: String
 *                  description: The costume description
 *              userId:
 *                  type: Schema.Types.ObjectId
 *                  ref: 'User'
 *                  required: true
 * 
 *          example:
 *              costumeId: <auto-generated>
 *              category: Fantasy
 *              costumeName: Gandalf the Grey
 *              rentalFee: 50.00
 *              size: Adult Medium
 *              imageUrl: https://images.unsplash.com/photo-1515599985634-73dc308d766f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80
 *              description: Summon your inner wizard with this realistic version of Gandalf's Costume.         
 *              userId: <auto-generated>
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
 *  name: Rentals
 *  description: The rental managing api
 * 
 */

/**
 * GET routes
 * @swagger
 * 
 * /costume/costumes:
 *      get:
 *          summary: Gets a list of all the costumes
 *          tags: [Rentals]
 *          responses:
 *              200:
 *                  description: List of costumes displayed
 *                  content:
 *                      application/json:
 *                          schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Costume'
 * 
 * /costume/costumes/{costumeId}:
 *      get:
 *          summary: Gets the details of the costume with the id
 *          tags: [Rentals]
 *          parameters:
 *            - in: path
 *              name: costumeId
 *              schema:
 *                  type: string
 *              required: true
 *              description: This is the costume id
 *          responses:
 *              200:
 *                  description: Costume information by costumeId
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Costume'
 *              404:
 *                  description: The costume was not found
 * 
 * /costume/cart:
 *      get:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Get the user's cart information for added costumes currently in the cart
 *          tags: [Rentals]
 *          responses:
 *              200:
 *                  description: Information about cart contents displayed
 *                  content:
 *                      application/json:
 *                          schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Costume'
 *
 * /costume/rentals:
 *      get:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Gets all rentals for a single user
 *          tags: [Rentals]
 *          responses:
 *              200:
 *                  description: Display list of rentals
 *                  content:
 *                      application/json:
 *                          schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Rentals'
 * 
 * /costume/rental/{rentalId}:
 *      get:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Gets the details of the rental with the rental id
 *          tags: [Rentals]
 *          parameters:
 *            - in: path
 *              name: rentalId
 *              schema:
 *                  type: string
 *              required: true
 *              description: This is the rental id
 *          responses:
 *              200:
 *                  description: Get rental information for a single past rental
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Rentals'
 *              404:
 *                  description: The rental was not found
 * 
 * /costume/checkout:
 *      get:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Gets checkout process
 *          tags: [Rentals]
 *          responses:
 *              200:
 *                  description: Starts checkout process for user
 *                  content:
 *                      application/json:
 *                          schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Rentals'
 * 
 * /costume/checkout/success:
 *      get:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Completes checkout and clears user cart
 *          tags: [Rentals]
 *          responses:
 *              200:
 *                  description: Checkout process completed
 *                  content:
 *                      application/json:
 *                          schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Rentals' 
 * 
 * /costume/checkout/cancel:
 *      get:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Cancels checkout process
 *          tags: [Rentals]
 *          responses:
 *              200:
 *                  description: Checkout process canceled
 *                  content:
 *                      application/json:
 *                          schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Rentals'
 */

/**
 * POST routes
 * @swagger
 * 
 * /costume/cart:
 *      post:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Add costume to cart for potential rental
 *          tags: [Rentals]
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
 * /costume/create-rental:
 *      post:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Submit costumes and create rental order
 *          tags: [Rentals]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Rentals'
 *          responses:
 *              200:
 *                  description: The rental was successfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Rentals'
 *              500:
 *                  description: There was a server error
 */

/**
 * DELETE routes
 * @swagger
 * 
 * /cart-delete-item:
 *      delete:
 *          security:
 *              - bearerAuth: [] 
 *          summary: Remove costume from cart
 *          tags: [Rentals]
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
 */