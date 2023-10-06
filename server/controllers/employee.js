'use strict';

const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Project = require('../models/Project');
const fileHelper = require('../util/file');

// ==================================================

// Lấy danh sách dữ liệu của tất cả nhân viên
exports.getAllList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const employees = await Employee.find()
      .populate('techStacks.techStack projects')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalEmployee = await Employee.count();

    res.status(200).json({ data: employees, total: totalEmployee });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả nhân viên chưa xóa
exports.getActiveList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const employees = await Employee.find({ isDelete: false })
      .populate('techStacks.techStack projects')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalEmployee = await Employee.find({ isDelete: false }).count();

    res.status(200).json({ data: employees, total: totalEmployee });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả nhân viên đã xóa
exports.getDeletedList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const employees = await Employee.find({ isDelete: true })
      .populate('techStacks.techStack projects')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalEmployee = await Employee.find({ isDelete: true }).count();

    res.status(200).json({ data: employees, total: totalEmployee });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy dữ liệu chi tiết của 1 nhân viên
exports.getDetail = async (req, res, next) => {
  const employeeId = req.params.employeeId;

  try {
    const employee = await Employee.findById(employeeId).populate(
      'techStacks.techStack'
    );

    if (!employee) {
      const error = new Error('Thông tin nhân viên không tồn tại!');

      error.statusCode = 404;

      throw error;
    }

    res.status(200).json(employee);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Tạo mới nhân viên
exports.create = async (req, res, next) => {
  const newEmployee = {
    fullName: req.body.fullName,
    idCard: req.body.idCard,
    dob: req.body.dob,
    gender: req.body.gender,
    phone: req.body.phone,
    experience: req.body.experience,
    certificate: JSON.parse(req.body.certificate),
    techStacks: JSON.parse(req.body.techStacks),
  };

  const image = req.files.image;

  try {
    if (!newEmployee.fullName) {
      const error = new Error('Họ tên nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newEmployee.idCard) {
      const error = new Error('CCCD của nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newEmployee.dob) {
      const error = new Error('Ngày sinh của nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newEmployee.gender) {
      const error = new Error('Giới tính của nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newEmployee.phone) {
      const error = new Error(
        'Số điện thoại của nhân viên không được để trống!'
      );

      error.statusCode = 422;

      throw error;
    }

    if (!newEmployee.experience) {
      const error = new Error('Kinh nghiệm của nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (newEmployee.techStacks.length === 0) {
      const error = new Error('Tech stack sử dụng không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const existEmployee = await Employee.findOne({
      idCard: newEmployee.idCard,
    });

    if (existEmployee) {
      const error = new Error('CCCD đã tồn tại. Mời nhập CCCD khác!');

      error.statusCode = 422;

      throw error;
    }

    const url = req.protocol + '://' + req.get('host');

    const employee = new Employee({
      ...newEmployee,
      avatar: url + '/static/images/' + image[0].filename,
    });

    const result = await employee.save();

    res.status(200).json({
      message: 'Thành công tạo mới dữ liệu!',
      result: result,
    });
  } catch (error) {
    // Xóa image nếu lỗi
    fileHelper.deleteFile(image[0].filename);

    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Chỉnh sửa nhân viên
exports.edit = async (req, res, next) => {
  const employeeId = req.params.employeeId;
  const updateEmployee = {
    avatar: req.body.image,
    fullName: req.body.fullName,
    idCard: req.body.idCard,
    dob: req.body.dob,
    gender: req.body.gender,
    phone: req.body.phone,
    experience: req.body.experience,
    certificate: JSON.parse(req.body.certificate),
    techStacks: JSON.parse(req.body.techStacks),
  };

  const image = req.files.image;

  try {
    if (!updateEmployee.fullName) {
      const error = new Error('Họ tên nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateEmployee.idCard) {
      const error = new Error('CCCD của nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateEmployee.dob) {
      const error = new Error('Ngày sinh của nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateEmployee.gender) {
      const error = new Error('Giới tính của nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateEmployee.phone) {
      const error = new Error(
        'Số điện thoại của nhân viên không được để trống!'
      );

      error.statusCode = 422;

      throw error;
    }

    if (!updateEmployee.experience) {
      const error = new Error('Kinh nghiệm của nhân viên không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (updateEmployee.techStacks.length === 0) {
      const error = new Error('Tech stack sử dụng không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (image) {
      const url = req.protocol + '://' + req.get('host');

      updateEmployee.avatar = url + '/static/images/' + image[0].filename;
    }

    const result = await Employee.findByIdAndUpdate(employeeId, updateEmployee);

    res
      .status(200)
      .json({ message: 'Thành công chỉnh sửa dữ liệu!', result: result });
  } catch (error) {
    if (image) {
      // Xóa image nếu lỗi
      fileHelper.deleteFile(image[0].filename);
    }

    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Xóa 1 nhân viên
exports.deleteOne = async (req, res, next) => {
  const employeeId = req.params.employeeId;

  try {
    const departments = await Department.find({ isDelete: false });
    const projects = await Project.find({ isDelete: false });

    const existedProject = projects.find((p) =>
      p.employees.find((e) => e.toString() === employeeId)
    );

    if (existedProject) {
      const error = new Error(
        'Nhân viên vẫn đang trong một dự án. Bạn không thể xóa!'
      );

      error.statusCode = 403;

      throw error;
    }

    await Employee.findByIdAndUpdate(employeeId, {
      isDelete: true,
    });

    const existedDepartment = departments.find((d) =>
      d.employees.find((e) => e.toString() === employeeId)
    );

    await existedDepartment.removeFromEmployees(employeeId);

    res.status(200).json({ message: 'Thành công xóa dữ liệu!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Xóa nhiều nhân viên
exports.deleteMany = async (req, res, next) => {
  const ids = req.body.ids;

  try {
    const departments = await Department.find({ isDelete: false });
    const projects = await Project.find({ isDelete: false });

    const existedProject = projects.find((p) =>
      p.employees.find((e) => ids.indexOf(e.toString()) > -1)
    );

    if (existedProject) {
      const error = new Error(
        'Có nhân viên vẫn đang trong một dự án. Bạn không thể xóa!'
      );

      error.statusCode = 403;

      throw error;
    }

    ids.map(async (id) => {
      await Employee.findByIdAndUpdate(id, {
        isDelete: true,
      });

      const existedDepartment = departments.find((d) =>
        d.employees.find((e) => e.toString() === id)
      );

      await existedDepartment.removeFromEmployees(id);
    });

    res.status(200).json({ message: 'Thành công xóa dữ liệu!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
