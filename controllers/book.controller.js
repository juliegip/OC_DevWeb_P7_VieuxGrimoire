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


exports.getAllBook = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};
  

exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: 'Livre non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getRatings = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.rateBook = async (req, res, next) => {
  const ratingObject = { grade: req.body.rating, userId: req.auth.userId };

  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (book.ratings.some((ratings) => ratings.userId === ratingObject.userId)) {
      return res.status(401).json({ message: 'Vous avez déjà évalué ce livre' });
    }

    book.ratings.push(ratingObject);

    const sum = book.ratings.reduce((total, curr) => (total += curr.grade), 0);
    const averageRating = sum / book.ratings.length;
    book.averageRating = Math.round(averageRating);

    const updatedBook = await Book.findOneAndUpdate({ _id: req.params.id }, book, {
      new: true,
    });

    res.status(201).json(updatedBook);
  } catch (error) {
    res.status(400).json({ error });
  }
};
