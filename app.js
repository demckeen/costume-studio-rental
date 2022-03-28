require('dotenv').config();
const PORT = process.env.PORT || 8080;
const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

//import routes
const costumeRoutes = require('./routes/costume');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();

// Swagger set up
const swagger_options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Costume Studio Rentals API',
      version: '1.0.0',
      description: 'A simple app to view and rent costumes.'
    },
    servers: [
        {
          url: `https://${process.env.HEROKU_APP}`
        },
        {
          url: 'http://localhost:8080'
        }
    ]
  },
  apis: ['./swagger/*.js']
};

const specs = swaggerJsDoc(swagger_options);

//view api contract at localhost:8080/api-docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(costumeRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next ) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({message: message, data: data});
})

const corsOptions = {
  origin: `https://${process.env.HEROKU_APP}`,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || MONGODB_URI;

// MongoDB connection
mongoose
  .connect(
    MONGODB_URL, options
    )
    .then(result => {
      const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
      const io = require('./socket').init(server, {
        cors: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'PUT']
        }});
      io.on('connection', socket => {
        console.log('Client connected');
      })})
    .catch(err => console.log(err))
