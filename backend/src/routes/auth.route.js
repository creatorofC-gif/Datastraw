// The Route of the authentication is defined in this file


const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
module.exports = router;
