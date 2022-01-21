const express = require('express');
const router = express.Router();
const { getSuggestions } = require('../controllers/suggestions');

router.route('/').get(getSuggestions);


module.exports = router;
