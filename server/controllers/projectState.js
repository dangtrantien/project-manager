'use strict';

const ProjectState = require('../models/ProjectState');
const Project = require('../models/Project');

// ==================================================

// Lấy danh sách dữ liệu của tất cả tình trạng dự án
exports.getAllList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const projectStates = await ProjectState.find()
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProjectState = await ProjectState.count();

    res.status(200).json({ data: projectStates, total: totalProjectState });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả tình trạng dự án chưa xóa
exports.getActiveList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const projectStates = await ProjectState.find({ isDelete: false })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProjectState = await ProjectState.find({
      isDelete: false,
    }).count();

    res.status(200).json({ data: projectStates, total: totalProjectState });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả tình trạng dự án đã xóa
exports.getDeletedList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const projectStates = await ProjectState.find({ isDelete: true })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProjectState = await ProjectState.find({
      isDelete: true,
    }).count();

    res.status(200).json({ data: projectStates, total: totalProjectState });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy dữ liệu chi tiết của 1 trạng thái dự án
exports.getDetail = async (req, res, next) => {
  const projectStateId = req.params.projectStateId;

  try {
    const projectState = await ProjectState.findById(projectStateId);

    if (!projectState) {
      const error = new Error('Thông tin trạng thái dự án không tồn tại!');

      error.statusCode = 404;

      throw error;
    }

    res.status(200).json(projectState);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Tạo mới trạng thái dự án
exports.create = async (req, res, next) => {
  const newProjectState = {
    name: req.body.name,
    short_desc: req.body.short_desc,
    long_desc: req.body.long_desc,
    state: req.body.state,
  };

  try {
    if (!newProjectState.name) {
      const error = new Error('Tên trạng thái dự án không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newProjectState.short_desc) {
      const error = new Error('Mô tả ngắn gọn không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newProjectState.long_desc) {
      const error = new Error('Mô tả chi tiết không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newProjectState.state) {
      const error = new Error('Trạng thái không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const projectState = new ProjectState(newProjectState);

    const result = await projectState.save();

    res.status(200).json({
      message: 'Thành công tạo mới dữ liệu!',
      result: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Chỉnh sửa trạng thái dự án
exports.edit = async (req, res, next) => {
  const projectStateId = req.params.projectStateId;
  const updateProjectState = {
    name: req.body.name,
    short_desc: req.body.short_desc,
    long_desc: req.body.long_desc,
    state: req.body.state,
  };

  try {
    if (!updateProjectState.name) {
      const error = new Error('Tên trạng thái dự án không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateProjectState.short_desc) {
      const error = new Error('Mô tả ngắn gọn không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateProjectState.long_desc) {
      const error = new Error('Mô tả chi tiết không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateProjectState.state) {
      const error = new Error('Trạng thái không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const result = await ProjectState.findByIdAndUpdate(
      projectStateId,
      updateProjectState
    );

    res
      .status(200)
      .json({ message: 'Thành công chỉnh sửa dữ liệu!', result: result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Xóa 1 trạng thái dự án
exports.deleteOne = async (req, res, next) => {
  const projectStateId = req.params.projectStateId;

  try {
    const projects = await Project.find({ isDelete: false });

    const existedProject = projects.find(
      (p) => p.projectState.toString() === projectStateId
    );

    if (existedProject) {
      const error = new Error(
        'Trạng thái vẫn đang được sử dụng trong một dự án. Bạn không thể xóa!'
      );

      error.statusCode = 403;

      throw error;
    }

    await ProjectState.findByIdAndUpdate(projectStateId, {
      isDelete: true,
    });

    res.status(200).json({ message: 'Thành công xóa dữ liệu!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Xóa nhiều trạng thái dự án
exports.deleteMany = async (req, res, next) => {
  const ids = req.body.ids;

  try {
    const projects = await Project.find({ isDelete: false });

    const existedProject = projects.find(
      (p) => ids.indexOf(p.projectState.toString()) > -1
    );

    if (existedProject) {
      const error = new Error(
        'Có trạng thái vẫn đang được sử dụng trong một dự án. Bạn không thể xóa!'
      );

      error.statusCode = 403;

      throw error;
    }

    ids.map(
      async (id) =>
        await ProjectState.findByIdAndUpdate(id, {
          isDelete: true,
        })
    );

    res.status(200).json({ message: 'Thành công xóa dữ liệu!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
