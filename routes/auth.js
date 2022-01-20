const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/auth');


// register
router.route('/register').post(registerAdmin);

// login
router.route('/login').post(loginAdmin);





module.exports = router
