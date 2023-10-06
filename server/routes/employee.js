'use strict';

const express = require('express');

const employeeController = require('../controllers/employee');
const isAuth = require('../middleware/isAuth');

// ==================================================

const router = express.Router();

router.get('/get-all-list', isAuth, employeeController.getAllList);

router.get('/get-active-list', isAuth, employeeController.getActiveList);

router.get('/get-deleted-list', isAuth, employeeController.getDeletedList);

router.get('/get-detail/:employeeId', isAuth, employeeController.getDetail);

router.post('/create', isAuth, employeeController.create);

router.put('/edit/:employeeId', isAuth, employeeController.edit);

router.delete('/delete-one/:employeeId', isAuth, employeeController.deleteOne);

router.delete('/delete-many', isAuth, employeeController.deleteMany);

module.exports = router;
