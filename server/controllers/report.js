'use strict';

const ProjectCategory = require('../models/ProjectCategory');
const ProjectState = require('../models/ProjectState');
const TechStack = require('../models/TechStack');
const Employee = require('../models/Employee');
const Project = require('../models/Project');

// ==================================================

exports.getEmployeeByExperience = async (req, res, next) => {
  try {
    const data = [];
    const experienceArr = ['fresher', 'junior', 'middle', 'senior'];
    const employees = await Employee.find({ isDelete: false });

    for (let i = 0; i < experienceArr.length; i++) {
      let total = 0;

      employees.map((e) => {
        if (e.experience === experienceArr[i]) {
          total++;
        }

        return e;
      });

      data.push({
        type: experienceArr[i],
        'tổng nhân viên': total,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getEmployeeByTechStack = async (req, res, next) => {
  try {
    const data = [];
    const employees = await Employee.find({ isDelete: false });
    const techStacks = await TechStack.find({
      isDelete: false,
      state: 'active',
    });

    for (let i = 0; i < techStacks.length; i++) {
      let total = 0;

      employees.map((e) => {
        e.techStacks.map((ts) => {
          if (ts.techStack.toString() === techStacks[i]._id.toString()) {
            total++;
          }

          return ts;
        });

        return e;
      });

      data.push({
        type: techStacks[i].name,
        'tổng nhân viên': total,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getEmployeeByJoinedProject = async (req, res, next) => {
  try {
    const data = [];
    const employees = await Employee.find({ isDelete: false });

    const max = Math.max(...employees.map((e) => e.projects.length));

    for (let i = 0; i <= max; i++) {
      let total = 0;

      employees.map((e) => {
        if (e.projects.length === i) {
          total++;
        }

        return e;
      });

      data.push({
        type: `Tham gia ${i} dự án`,
        'tổng nhân viên': total,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getProjectByCategory = async (req, res, next) => {
  const year = req.query.year;

  try {
    const data = [];
    const projectCategorys = await ProjectCategory.find({
      isDelete: false,
      state: 'active',
    });
    const projects = await Project.find({ isDelete: false });

    for (let i = 0; i < 12; i++) {
      const month = `Tháng ${i + 1}`;

      for (let j = 0; j < projectCategorys.length; j++) {
        let total = 0;

        projects.map((p) => {
          if (new Date(p.createdAt).getFullYear() === +year) {
            if (new Date(p.createdAt).getMonth() === i) {
              if (
                p.category.toString() === projectCategorys[j]._id.toString()
              ) {
                total++;
              }
            }
          }

          return p;
        });

        data.push({
          month: month,
          type: projectCategorys[j].name,
          'tổng dự án': total,
        });
      }
    }

    res.status(200).json(data);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getProjectByProjectState = async (req, res, next) => {
  const year = req.query.year;

  try {
    const data = [];
    const projectStates = await ProjectState.find({
      isDelete: false,
      state: 'active',
    });
    const projects = await Project.find({ isDelete: false });

    for (let i = 0; i < 12; i++) {
      const month = `Tháng ${i + 1}`;

      for (let j = 0; j < projectStates.length; j++) {
        let total = 0;

        projects.map((p) => {
          if (new Date(p.createdAt).getFullYear() === +year) {
            if (new Date(p.createdAt).getMonth() === i) {
              if (
                p.projectState.toString() === projectStates[j]._id.toString()
              ) {
                total++;
              }
            }
          }

          return p;
        });

        data.push({
          month: month,
          type: projectStates[j].name,
          'tổng dự án': total,
        });
      }
    }

    res.status(200).json(data);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getProjectByTechStack = async (req, res, next) => {
  const year = req.query.year;

  try {
    const data = [];
    const techStacks = await TechStack.find({
      isDelete: false,
      state: 'active',
    });
    const projects = await Project.find({ isDelete: false });

    for (let i = 0; i < 12; i++) {
      const month = `Tháng ${i + 1}`;

      for (let j = 0; j < techStacks.length; j++) {
        let total = 0;

        projects.map((p) => {
          if (new Date(p.createdAt).getFullYear() === +year) {
            if (new Date(p.createdAt).getMonth() === i) {
              p.techStacks.map((ts) => {
                if (ts.toString() === techStacks[j]._id.toString()) {
                  total++;
                }

                return ts;
              });
            }
          }

          return p;
        });

        data.push({
          month: month,
          type: techStacks[j].name,
          'tổng dự án': total,
        });
      }
    }

    res.status(200).json(data);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
