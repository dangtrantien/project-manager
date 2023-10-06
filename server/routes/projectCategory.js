'use strict';

const express = require('express');

const projectCategoryController = require('../controllers/projectCategory');
const isAuth = require('../middleware/isAuth');

// ==================================================

const router = express.Router();

router.get('/get-all-list', isAuth, projectCategoryController.getAllList);

router.get('/get-active-list', isAuth, projectCategoryController.getActiveList);

router.get(
  '/get-deleted-list',
  isAuth,
  projectCategoryController.getDeletedList
);

router.get(
  '/get-detail/:projectCategoryId',
  isAuth,
  projectCategoryController.getDetail
);

router.post('/create', isAuth, projectCategoryController.create);

router.put('/edit/:projectCategoryId', isAuth, projectCategoryController.edit);

router.delete(
  '/delete-one/:projectCategoryId',
  isAuth,
  projectCategoryController.deleteOne
);

router.delete('/delete-many', isAuth, projectCategoryController.deleteMany);

module.exports = router;
