'use strict';

const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/isAuth');

// ==================================================

const router = express.Router();

router.get('/user', userController.getUser);

router.post('/login', userController.postLogin);

router.post('/register', userController.postRegister);

router.post('/logout', userController.postLogout);

module.exports = router;
