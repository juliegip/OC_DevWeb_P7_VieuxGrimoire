const express = require('express');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/books.router');
const userRoutes = require('./routes/users.router')

mongoose.connect('mongodb+srv://juliegipweb:eYmkGN3XtbAFypYe@cluster0.ogaos5n.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp', 
{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
    .then(() => console.log('Connexion à MongoDB réussie!') )
    .catch(() => console.log('Connexion à MongoDB échouée'));


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

module.exports = app;