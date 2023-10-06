'use strict';

const ProjectCategory = require('../models/ProjectCategory');
const Project = require('../models/Project');

// ==================================================

// Lấy danh sách dữ liệu của tất cả loại dự án
exports.getAllList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const projectCategorys = await ProjectCategory.find()
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProjectCategory = await ProjectCategory.count();

    res
      .status(200)
      .json({ data: projectCategorys, total: totalProjectCategory });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả loại dự án chưa xóa
exports.getActiveList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const projectCategorys = await ProjectCategory.find({ isDelete: false })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProjectCategory = await ProjectCategory.find({
      isDelete: false,
    }).count();

    res
      .status(200)
      .json({ data: projectCategorys, total: totalProjectCategory });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả loại dự án đã xóa
exports.getDeletedList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const projectCategorys = await ProjectCategory.find({ isDelete: true })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProjectCategory = await ProjectCategory.find({
      isDelete: true,
    }).count();

    res
      .status(200)
      .json({ data: projectCategorys, total: totalProjectCategory });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy dữ liệu chi tiết của 1 loại dự án
exports.getDetail = async (req, res, next) => {
  const projectCategoryId = req.params.projectCategoryId;

  try {
    const projectCategory = await ProjectCategory.findById(projectCategoryId);

    if (!projectCategory) {
      const error = new Error('Thông tin loại dự án không tồn tại!');

      error.statusCode = 404;

      throw error;
    }

    res.status(200).json(projectCategory);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Tạo mới loại dự án
exports.create = async (req, res, next) => {
  const newProjectCategory = {
    name: req.body.name,
    short_desc: req.body.short_desc,
    long_desc: req.body.long_desc,
    priority: req.body.priority,
    state: req.body.state,
  };

  try {
    if (!newProjectCategory.name) {
      const error = new Error('Tên loại dự án không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newProjectCategory.short_desc) {
      const error = new Error('Mô tả ngắn gọn không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newProjectCategory.long_desc) {
      const error = new Error('Mô tả chi tiết không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (
      !newProjectCategory.priority ||
      newProjectCategory.priority < 1 ||
      newProjectCategory.priority > 5
    ) {
      const error = new Error(
        'Mức độ ưu tiên không được để trống và chỉ trong khoảng từ 1-5!'
      );

      error.statusCode = 422;

      throw error;
    }

    if (!newProjectCategory.state) {
      const error = new Error('Trạng thái không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const projectCategory = new ProjectCategory(newProjectCategory);

    const result = await projectCategory.save();

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

// Chỉnh sửa loại dự án
exports.edit = async (req, res, next) => {
  const projectCategoryId = req.params.projectCategoryId;
  const updateProjectCategory = {
    name: req.body.name,
    short_desc: req.body.short_desc,
    long_desc: req.body.long_desc,
    priority: req.body.priority,
    state: req.body.state,
  };

  try {
    if (!updateProjectCategory.name) {
      const error = new Error('Tên loại dự án không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateProjectCategory.short_desc) {
      const error = new Error('Mô tả ngắn gọn không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateProjectCategory.long_desc) {
      const error = new Error('Mô tả chi tiết không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (
      !updateProjectCategory.priority ||
      +updateProjectCategory.priority < 1 ||
      +updateProjectCategory.priority > 5
    ) {
      const error = new Error(
        'Mức độ ưu tiên không được để trống và chỉ trong khoảng từ 1-5!'
      );

      error.statusCode = 422;

      throw error;
    }

    if (!updateProjectCategory.state) {
      const error = new Error('Trạng thái không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const result = await ProjectCategory.findByIdAndUpdate(
      projectCategoryId,
      updateProjectCategory
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

// Xóa 1 loại dự án
exports.deleteOne = async (req, res, next) => {
  const projectCategoryId = req.params.projectCategoryId;

  try {
    const projects = await Project.find({ isDelete: false });

    const existedProject = projects.find(
      (p) => p.category.toString() === projectCategoryId
    );

    if (existedProject) {
      const error = new Error(
        'Thể loại vẫn đang được sử dụng trong một dự án. Bạn không thể xóa!'
      );

      error.statusCode = 403;

      throw error;
    }

    await ProjectCategory.findByIdAndUpdate(projectCategoryId, {
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

// Xóa nhiều loại dự án
exports.deleteMany = async (req, res, next) => {
  const ids = req.body.ids;

  try {
    const projects = await Project.find({ isDelete: false });

    const existedProject = projects.find(
      (p) => ids.indexOf(p.category.toString()) > -1
    );

    if (existedProject) {
      const error = new Error(
        'Có thể loại vẫn đang được sử dụng trong một dự án. Bạn không thể xóa!'
      );

      error.statusCode = 403;

      throw error;
    }

    ids.map(
      async (id) =>
        await ProjectCategory.findByIdAndUpdate(id, {
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
