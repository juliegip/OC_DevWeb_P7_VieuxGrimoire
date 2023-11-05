const Book = require('../models/Book')
const sharp = require ('sharp')
const fs = require('fs').promises


exports.addBook = async (req, res, next) => {
    try {
      const bookObject = JSON.parse(req.body.book);
      const imageBuffer = await sharp(req.file.buffer).webp().toBuffer();
  
      const imageFileName =
        req.file.originalname.split(' ').join('_') + Date.now() + '.webp';
  
      await sharp(imageBuffer)
        .toFile('images/' + imageFileName)
        .catch((err) => {
          return res.status(500).json({ error: "L'image n'a pas pu être sauvegardée" });
        });
  
      delete bookObject._id;
      delete bookObject.userId;
  
      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${imageFileName}`,
      });
  
      await book.save();
  
      res.status(201).json({ message: 'Livre ajouté !' });
    } catch (error) {
      res.status(400).json({ error });
    }
  };
  

exports.modifyBook = async (req, res, next) => {
    try {
        const bookObject = req.file
            ? {
                  ...JSON.parse(req.body.book),
                  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
              }
            : {
                  ...req.body,
              };

        const book = await Book.findOne({ _id: req.params.id });

        if (book.userId !== req.auth.userId) {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
        res.status(200).json({ message: 'Livre modifié' });
    } catch (error) {
        res.status(404).json({ error });
    }
};


exports.deleteBook = async (req, res, next) => {
    try {
      const book = await Book.findOne({ _id: req.params.id });
  
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Non autorisé' });
      }
  
      const filename = book.imageUrl.split('/images/')[1];
      await fs.unlink(`images/${filename}`); // Use 'await' for asynchronous file deletion
  
      await Book.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Livre supprimé' });
    } catch (error) {
      res.status(500).json({ error });
    }
  };


exports.getAllBook = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({error}))
}

exports.getOneBook = (req, res, next) => {
   Book.findOne( {_id: req.params.id})
    .then( book => res.status(200).json(book))
    .catch(error => res.status(404).json({error}))
}


exports.getRatings = (req, res, next) => {
    Book.find().sort({averageRating:-1}).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({error}))
}

exports.rateBook = (req, res, next) => {
    const ratingObject = {grade: req.body.rating, userId: req.auth.userId}

    Book.findOne({_id:req.params.id})
        .then((book) => {
            if (book.ratings.some((ratings)=> ratings.userId === ratingObject.userId)) {
                res.status(401).json({message:'Vous avez déjà évalué ce livre'})
                return
            } else {
                book.ratings.push(ratingObject)
                const sum = book.ratings.reduce((total,curr) => (total += curr.grade),0)
                const averageRating = sum / book.ratings.length
                book.averageRating = Math.round(averageRating)

                Book.findOneAndUpdate({_id: req.params.id}, book, {new:true})
                .then((updatedBook) => {
                    res.status(201).json(updatedBook);
                })
                .catch((error) => res.status(400).json({ error }))
                
            }
        })
  
        .catch(error => res.status(400).json({error}))
    
}