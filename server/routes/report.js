'use strict';

const express = require('express');

const reportController = require('../controllers/report');
const isAuth = require('../middleware/isAuth');

// ==================================================

const router = express.Router();

router.get(
  '/employee/experience',
  isAuth,
  reportController.getEmployeeByExperience
);

router.get(
  '/employee/tech-stack',
  isAuth,
  reportController.getEmployeeByTechStack
);

router.get(
  '/employee/joined-project',
  isAuth,
  reportController.getEmployeeByJoinedProject
);

router.get('/project/category', isAuth, reportController.getProjectByCategory);

router.get(
  '/project/project-state',
  isAuth,
  reportController.getProjectByProjectState
);

router.get(
  '/project/tech-stack',
  isAuth,
  reportController.getProjectByTechStack
);

module.exports = router;
