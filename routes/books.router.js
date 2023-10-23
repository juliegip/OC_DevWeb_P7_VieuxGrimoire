const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const multer = require('../config/multer')

const bookCtrl = require('../controllers/book.controller')

router.get('/',bookCtrl.getAllBook)
router.get('/:id', bookCtrl.getOneBook)
// router.get('/bestrating',bookCtrl.getRatings)
router.post('/',auth,multer, bookCtrl.addBook)
router.put('/:id',auth, multer, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)
router.post('/:id/rating', auth, bookCtrl.rateBook)


module.exports = router;