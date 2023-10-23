const mongoose = require('mongoose')

exports.connect = () => {
    mongoose.connect('mongodb+srv://juliegipweb:eYmkGN3XtbAFypYe@cluster0.ogaos5n.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp', 
{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
    .then(() => console.log('Connexion à MongoDB réussie!') )
    .catch(() => console.log('Connexion à MongoDB échouée'));


}