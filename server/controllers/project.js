'use strict';

const Project = require('../models/Project');
const Department = require('../models/Department');
const Employee = require('../models/Employee');

// ==================================================

// Lấy danh sách dữ liệu của tất cả dự án
exports.getAllList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const projects = await Project.find()
      .populate('category projectState techStacks departments employees')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProject = await Project.count();

    res.status(200).json({ data: projects, total: totalProject });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả dự án chưa xóa
exports.getActiveList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const projects = await Project.find({ isDelete: false })
      .populate('category projectState techStacks departments employees')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProject = await Project.find({ isDelete: false }).count();

    res.status(200).json({ data: projects, total: totalProject });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả dự án đã xóa
exports.getDeletedList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const projects = await Project.find({ isDelete: true })
      .populate('category projectState techStacks departments employees')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProject = await Project.find({ isDelete: true }).count();

    res.status(200).json({ data: projects, total: totalProject });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy dữ liệu chi tiết của 1 dự án
exports.getDetail = async (req, res, next) => {
  const projectId = req.params.projectId;

  try {
    const project = await Project.findById(projectId).populate(
      'category projectState techStacks'
    );

    if (!project) {
      const error = new Error('Thông tin dự án không tồn tại!');

      error.statusCode = 404;

      throw error;
    }

    res.status(200).json(project);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Tạo mới dự án
exports.create = async (req, res, next) => {
  const newProject = {
    name: req.body.name,
    category: req.body.category,
    projectState: req.body.projectState,
    techStacks: req.body.techStacks,
    departments: req.body.departments,
    employees: req.body.employees,
  };

  try {
    if (!newProject.name) {
      const error = new Error('Tên dự án không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newProject.category) {
      const error = new Error('Thể loại dự án không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newProject.projectState) {
      const error = new Error('Trạng thái dự án không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (newProject.techStacks.length === 0) {
      const error = new Error('Tech stack sử dụng không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (newProject.departments.length === 0) {
      const error = new Error('Bộ phận phụ trách không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (newProject.employees.length === 0) {
      const error = new Error('Nhân viên tham gia không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const project = new Project(newProject);

    const result = await project.save();

    newProject.departments.map(async (d) => {
      const department = await Department.findById(d);

      department.addToProjects(result._id);
    });

    newProject.employees.map(async (e) => {
      const employee = await Employee.findById(e);

      employee.addToProjects(result._id);
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

// Chỉnh sửa dự án
exports.edit = async (req, res, next) => {
  const projectId = req.params.projectId;
  const updateProject = {
    name: req.body.name,
    category: req.body.category,
    projectState: req.body.projectState,
    techStacks: req.body.techStacks,
    departments: req.body.departments,
    employees: req.body.employees,
  };

  try {
    if (!updateProject.name) {
      const error = new Error('Tên dự án không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateProject.category) {
      const error = new Error('Thể loại dự án không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateProject.projectState) {
      const error = new Error('Trạng thái dự án không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (updateProject.techStacks.length === 0) {
      const error = new Error('Tech stack sử dụng không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (updateProject.departments.length === 0) {
      const error = new Error('Bộ phận phụ trách không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (updateProject.employees.length === 0) {
      const error = new Error('Nhân viên tham gia không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const result = await Project.findByIdAndUpdate(projectId, updateProject);

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

// Xóa 1 dự án
exports.deleteOne = async (req, res, next) => {
  const projectId = req.params.projectId;

  try {
    const departments = await Department.find({ isDelete: false });
    const employees = await Employee.find({ isDelete: false });

    await Project.findByIdAndUpdate(projectId, {
      isDelete: true,
    });

    departments.map(async (d) => {
      const existedDepartment = d.projects.find(
        (p) => p.toString() === projectId
      );

      if (existedDepartment) {
        await d.removeFromProjects(projectId);
      }
    });

    employees.map(async (e) => {
      const existedEmployee = e.projects.find(
        (p) => p.toString() === projectId
      );

      if (existedEmployee) {
        await e.removeFromProjects(projectId);
      }
    });

    res.status(200).json({ message: 'Thành công xóa dữ liệu!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Xóa nhiều dự án
exports.deleteMany = async (req, res, next) => {
  const ids = req.body.ids;

  try {
    const departments = await Department.find({ isDelete: false });
    const employees = await Employee.find({ isDelete: false });

    ids.map(async (id) => {
      await Project.findByIdAndUpdate(id, {
        isDelete: true,
      });

      departments.map(async (d) => {
        const existedDepartment = d.projects.find((p) => p.toString() === id);

        if (existedDepartment) {
          await d.removeFromProjects(id);
        }
      });

      employees.map(async (e) => {
        const existedEmployee = e.projects.find((p) => p.toString() === id);

        if (existedEmployee) {
          await e.removeFromProjects(id);
        }
      });
    });

    res.status(200).json({ message: 'Thành công xóa dữ liệu!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
