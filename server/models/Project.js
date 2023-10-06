'use strict';

const mongoose = require('mongoose');

// ==================================================

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'ProjectCategory',
      required: true,
    },
    projectState: {
      type: Schema.Types.ObjectId,
      ref: 'ProjectState',
      required: true,
    },
    techStacks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TechStack',
        required: true,
      },
    ],
    departments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
      },
    ],
    employees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
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

// Thêm id phòng ban
projectSchema.methods.addToDepartments = function (departmentId) {
  const updatedDepartments = [...this.departments, departmentId];

  this.departments = updatedDepartments;

  return this.save();
};

// Xóa id techStack
projectSchema.methods.removeFromTechStacks = function (techStackId) {
  const updatedTechStacks = [...this.techStacks].filter(
    (ts) => ts.toString() !== techStackId
  );

  this.techStacks = updatedTechStacks;

  return this.save();
};

module.exports = mongoose.model('Project', projectSchema);
