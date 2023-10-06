'use strict';

const express = require('express');

const projectStateController = require('../controllers/projectState');
const isAuth = require('../middleware/isAuth');

// ==================================================

const router = express.Router();

router.get('/get-all-list', isAuth, projectStateController.getAllList);

router.get('/get-active-list', isAuth, projectStateController.getActiveList);

router.get('/get-deleted-list', isAuth, projectStateController.getDeletedList);

router.get(
  '/get-detail/:projectStateId',
  isAuth,
  projectStateController.getDetail
);

router.post('/create', isAuth, projectStateController.create);

router.put('/edit/:projectStateId', isAuth, projectStateController.edit);

router.delete(
  '/delete-one/:projectStateId',
  isAuth,
  projectStateController.deleteOne
);

router.delete('/delete-many', isAuth, projectStateController.deleteMany);

module.exports = router;
