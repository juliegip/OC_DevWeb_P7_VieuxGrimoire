require('dotenv').config();
require("./config/database").connect();
const express = require('express');
const path = require('path');

const bookRoutes = require('./routes/books.router');
const userRoutes = require('./routes/users.router');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });      

app.use(express.json());  // donne accès au body de la requête (ancienne méthode : bodyparser())

app.use('/api/books',bookRoutes)
app.use('/api/auth',userRoutes)
app.use('/images',express.static(path.join(__dirname,'images')))

module.exports = app;