const express = require('express')
const router = express.Router()

const bookCtrl = require('../controllers/book.controller')

router.get('/',bookCtrl.getAllBook)
router.get('/:id',bookCtrl.getOneBook)
router.post('/',bookCtrl.addBook)
router.get('/bestrating',bookCtrl.getRatings)


module.exports = router;