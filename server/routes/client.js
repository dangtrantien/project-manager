'use strict';

const express = require('express');

const clientController = require('../controllers/client');
const isAuth = require('../middleware/isAuth');

// ==================================================

const router = express.Router();

router.get('/get-all-list', isAuth, clientController.getAllList);

router.get('/get-active-list', isAuth, clientController.getActiveList);

router.get('/get-deleted-list', isAuth, clientController.getDeletedList);

router.get('/get-detail/:clientId', isAuth, clientController.getDetail);

router.post('/create', isAuth, clientController.create);

router.put('/edit/:clientId', isAuth, clientController.edit);

router.delete('/delete-one/:clientId', isAuth, clientController.deleteOne);

router.delete('/delete-many', isAuth, clientController.deleteMany);

module.exports = router;
