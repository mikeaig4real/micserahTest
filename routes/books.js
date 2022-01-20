const express = require('express');
const router = express.Router();
const { getAllBooks,getSingleBook,createSingleBook,deleteSingleBook,updateSingleBook } = require('../controllers/books');

router.route('/').post(createSingleBook);
router.route('/:id').delete(deleteSingleBook).patch(updateSingleBook);


module.exports = router;
