'use strict';

const express = require('express');

const techStackController = require('../controllers/techStack');
const isAuth = require('../middleware/isAuth');

// ==================================================

const router = express.Router();

router.get('/get-all-list', isAuth, techStackController.getAllList);

router.get('/get-active-list', isAuth, techStackController.getActiveList);

router.get('/get-deleted-list', isAuth, techStackController.getDeletedList);

router.get('/get-detail/:techStackId', isAuth, techStackController.getDetail);

router.post('/create', isAuth, techStackController.create);

router.put('/edit/:techStackId', isAuth, techStackController.edit);

router.delete(
  '/delete-one/:techStackId',
  isAuth,
  techStackController.deleteOne
);

router.delete('/delete-many', isAuth, techStackController.deleteMany);

module.exports = router;
