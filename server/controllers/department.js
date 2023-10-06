'use strict';

const Department = require('../models/Department');
const Project = require('../models/Project');

// ==================================================

// Lấy danh sách dữ liệu của tất cả phòng ban
exports.getAllList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const departments = await Department.find()
      .populate('techStacks projects employees')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalDepartment = await Department.count();

    res.status(200).json({ data: departments, total: totalDepartment });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả phòng ban chưa xóa
exports.getActiveList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const departments = await Department.find({ isDelete: false })
      .populate('techStacks projects employees')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalDepartment = await Department.find({ isDelete: false }).count();

    res.status(200).json({ data: departments, total: totalDepartment });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả phòng ban đã xóa
exports.getDeletedList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const departments = await Department.find({ isDelete: true })
      .populate('techStacks projects employees')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalDepartment = await Department.find({ isDelete: true }).count();

    res.status(200).json({ data: departments, total: totalDepartment });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy dữ liệu chi tiết của 1 phòng ban
exports.getDetail = async (req, res, next) => {
  const departmentId = req.params.departmentId;

  try {
    const department = await Department.findById(departmentId).populate(
      'techStacks'
    );

    if (!department) {
      const error = new Error('Thông tin phòng ban không tồn tại!');

      error.statusCode = 404;

      throw error;
    }

    res.status(200).json(department);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Tạo mới phòng ban
exports.create = async (req, res, next) => {
  const newDepartment = {
    name: req.body.name,
    mission: req.body.mission,
    techStacks: req.body.techStacks,
    projects: req.body.projects,
    employees: req.body.employees,
  };

  try {
    if (!newDepartment.name) {
      const error = new Error('Tên phòng ban không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newDepartment.mission) {
      const error = new Error('Nhiệm vụ của phòng ban không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (newDepartment.techStacks.length === 0) {
      const error = new Error('Tech stack sử dụng không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (newDepartment.employees.length === 0) {
      const error = new Error('Nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const department = new Department(newDepartment);

    const result = await department.save();

    newDepartment.projects.map(async (p) => {
      const project = await Project.findById(p);

      project.addToDepartments(result._id);
    });

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

// Chỉnh sửa phòng ban
exports.edit = async (req, res, next) => {
  const departmentId = req.params.departmentId;
  const updateDepartment = {
    name: req.body.name,
    mission: req.body.mission,
    techStacks: req.body.techStacks,
    projects: req.body.projects,
    employees: req.body.employees,
  };

  try {
    if (!updateDepartment.name) {
      const error = new Error('Tên phòng ban không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateDepartment.mission) {
      const error = new Error('Nhiệm vụ của phòng ban không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (updateDepartment.techStacks.length === 0) {
      const error = new Error('Tech stack sử dụng không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (updateDepartment.employees.length === 0) {
      const error = new Error('Nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const result = await Department.findByIdAndUpdate(
      departmentId,
      updateDepartment
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

// Xóa 1 phòng ban
exports.deleteOne = async (req, res, next) => {
  const departmentId = req.params.departmentId;

  try {
    const projects = await Project.find({ isDelete: false });

    const existedProject = projects.find((p) =>
      p.departments.find((d) => d.toString() === departmentId)
    );

    if (existedProject) {
      const error = new Error(
        'Bộ phận vẫn đang trong một dự án. Bạn không thể xóa!'
      );

      error.statusCode = 403;

      throw error;
    }

    await Department.findByIdAndUpdate(departmentId, {
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

// Xóa nhiều phòng ban
exports.deleteMany = async (req, res, next) => {
  const ids = req.body.ids;

  try {
    const projects = await Project.find({ isDelete: false });

    const existedProject = projects.find((p) =>
      p.departments.find((d) => ids.indexOf(d.toString()) > -1)
    );

    if (existedProject) {
      const error = new Error(
        'Có bộ phận vẫn đang trong một dự án. Bạn không thể xóa!'
      );

      error.statusCode = 403;

      throw error;
    }

    ids.map(
      async (id) =>
        await Department.findByIdAndUpdate(id, {
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
