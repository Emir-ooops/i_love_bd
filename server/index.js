require('dotenv').config();

const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileupload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');

const port = process.env.PORT || 7000;

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // URL вашего фронтенда
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileupload({}))
app.use('/api', router);
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.originalUrl}`)
    next()
})
app.use(errorHandler)

const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(port, () => console.log(`Listening on port ${port}`));
    } catch (e) {
        console.log(e)
    }
}

start();