'use strict';

const mongoose = require('mongoose');

// ==================================================

const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    idCard: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    certificate: {
      type: Array,
      required: false,
    },
    techStacks: [
      {
        techStack: {
          type: Schema.Types.ObjectId,
          ref: 'TechStack',
          required: true,
        },
        techStackExperience: {
          type: String,
          required: true,
        },
        framework: {
          type: String,
          required: true,
        },
      },
    ],
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: false,
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
employeeSchema.methods.addToProjects = function (projectId) {
  const updatedProjects = [...this.projects, projectId];

  this.projects = updatedProjects;

  return this.save();
};

// Xóa id techStack
employeeSchema.methods.removeFromTechStacks = function (techStackId) {
  const updatedTechStacks = [...this.techStacks].filter(
    (ts) => ts.techStack.toString() !== techStackId
  );

  this.techStacks = updatedTechStacks;

  return this.save();
};

// Xóa id dự án
employeeSchema.methods.removeFromProjects = function (projectId) {
  const updatedProjects = [...this.projects].filter(
    (p) => p.toString() !== projectId
  );

  this.projects = updatedProjects;

  return this.save();
};

module.exports = mongoose.model('Employee', employeeSchema);
