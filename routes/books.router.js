const express = require('express')
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')
const router = express.Router()

const bookCtrl = require('../controllers/book.controller')

router.get('/',bookCtrl.getAllBook)
router.get('/bestrating',bookCtrl.getRatings)
router.post('/',auth, multer, bookCtrl.addBook)
router.get('/:id', bookCtrl.getOneBook)
router.put('/:id',auth, multer, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)
router.post('/:id/rating', auth, bookCtrl.rateBook)


module.exports = router;