'use strict';

const userRouter = require('./user');
const projectCategoryRouter = require('./projectCategory');
const projectStateRouter = require('./projectState');
const techStackRouter = require('./techStack');
const clientRouter = require('./client');
const departmentRouter = require('./department');
const employeeRouter = require('./employee');
const projectRouter = require('./project');
const reportRouter = require('./report');

// ==================================================

const router = (app) => {
  app.use('/api', userRouter);
  app.use('/api/admin/project-category', projectCategoryRouter);
  app.use('/api/admin/project-state', projectStateRouter);
  app.use('/api/admin/tech-stack', techStackRouter);
  app.use('/api/admin/client', clientRouter);
  app.use('/api/admin/department', departmentRouter);
  app.use('/api/admin/employee', employeeRouter);
  app.use('/api/admin/project', projectRouter);
  app.use('/api/admin/report', reportRouter);
};

module.exports = router;
