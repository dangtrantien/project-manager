'use strict';

const mongoose = require('mongoose');

// ==================================================

const Schema = mongoose.Schema;

const techStackSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    short_desc: {
      type: String,
      required: true,
    },
    long_desc: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
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

module.exports = mongoose.model('TechStack', techStackSchema);
