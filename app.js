require('dotenv').config();
const PORT = process.env.PORT || 8080;
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URI;
const path = require('path');
const multer = require('multer');

//For WINDOWS image handling
const { v4: uuidv4 } = require('uuid');
 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4())
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// Swagger set up
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Costume Studio Rentals API',
            version: '1.0.0',
            description: 'A simple app to view and rent costumes.'
        },
        servers: [
            {
                url: 'http://localhost:8080'
            }
        ],
    },
    apis: ['./swagger/*.js']
};

const specs = swaggerJsDoc(options);

//import routes
const costumeRoutes = require('./routes/costume');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();

//view api contract at localhost:8080/api-docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// app.use(bodyParser.urlencoded({ extended: false })); // x-www-form-urlencoded <form>
app.use(bodyParser.json({ type: 'application/*+json' })); // application/json
app.use(multer({storage: storage, fileFilter: fileFilter})
    .single('image')
    )
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/costume/', costumeRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next ) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
})

// MongoDB connection
mongoose.connect(MONGODB_URL)
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
