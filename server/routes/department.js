'use strict';

const express = require('express');

const departmentController = require('../controllers/department');
const isAuth = require('../middleware/isAuth');

// ==================================================

const router = express.Router();

router.get('/get-all-list', isAuth, departmentController.getAllList);

router.get('/get-active-list', isAuth, departmentController.getActiveList);

router.get('/get-deleted-list', isAuth, departmentController.getDeletedList);

router.get('/get-detail/:departmentId', isAuth, departmentController.getDetail);

router.post('/create', isAuth, departmentController.create);

router.put('/edit/:departmentId', isAuth, departmentController.edit);

router.delete(
  '/delete-one/:departmentId',
  isAuth,
  departmentController.deleteOne
);

router.delete('/delete-many', isAuth, departmentController.deleteMany);

module.exports = router;
