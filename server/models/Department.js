'use strict';

const mongoose = require('mongoose');

// ==================================================

const Schema = mongoose.Schema;

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mission: {
      type: String,
      required: true,
    },
    techStacks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TechStack',
        required: true,
      },
    ],
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        requried: false,
      },
    ],
    employees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        requried: true,
      },
    ],
    isDelete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Thêm id dự án
departmentSchema.methods.addToProjects = function (projectId) {
  const updatedProjects = [...this.projects, projectId];

  this.projects = updatedProjects;

  return this.save();
};

// Xóa id tech stack
departmentSchema.methods.removeFromTechStacks = function (techStackId) {
  const updatedTechStacks = [...this.techStacks].filter(
    (ts) => ts.toString() !== techStackId
  );

  this.techStacks = updatedTechStacks;

  return this.save();
};

// Xóa id dự án
departmentSchema.methods.removeFromProjects = function (projectId) {
  const updatedProjects = [...this.projects].filter(
    (p) => p.toString() !== projectId
  );

  this.projects = updatedProjects;

  return this.save();
};

// Xóa id nhân viên
departmentSchema.methods.removeFromEmployees = function (employeeId) {
  const updatedEmployees = [...this.employees].filter(
    (e) => e.toString() !== employeeId
  );

  this.employees = updatedEmployees;

  return this.save();
};

module.exports = mongoose.model('Department', departmentSchema);
