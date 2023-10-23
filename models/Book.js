const mongoose = require('mongoose')

const ratingSchema = mongoose.Schema({
    userId:{type: String, required:false},
    grade: {type: Number, required:false}
})

const bookSchema = mongoose.Schema({
    userId: {type: String, required:false},
    title: {type: String, required: false},
    author: {type: String, required: false},
    imageUrl: {type: String, required: false},
    year: {type: Number, required: false},
    genre: {type: String, required: false},
    ratings: [ratingSchema],
    averageRating: {type: Number, required:false}
})

module.exports = mongoose.model('Book', bookSchema)