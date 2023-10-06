'use strict';

const express = require('express');

const projectController = require('../controllers/project');
const isAuth = require('../middleware/isAuth');

// ==================================================

const router = express.Router();

router.get('/get-all-list', isAuth, projectController.getAllList);

router.get('/get-active-list', isAuth, projectController.getActiveList);

router.get('/get-deleted-list', isAuth, projectController.getDeletedList);

router.get('/get-detail/:projectId', isAuth, projectController.getDetail);

router.post('/create', isAuth, projectController.create);

router.put('/edit/:projectId', isAuth, projectController.edit);

router.delete('/delete-one/:projectId', isAuth, projectController.deleteOne);

router.delete('/delete-many', isAuth, projectController.deleteMany);

module.exports = router;
