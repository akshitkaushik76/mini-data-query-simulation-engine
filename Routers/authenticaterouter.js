const express = require('express');
const authcontroller = require('../Controllers/authenticatecontroller')
const router = express.Router();
router.route('/signup').post(authcontroller.Signup);
router.route('/login').post(authcontroller.loginStudent);

module.exports = router;