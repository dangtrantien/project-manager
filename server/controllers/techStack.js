'use strict';

const TechStack = require('../models/TechStack');
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const Project = require('../models/Project');

// ==================================================

// Lấy danh sách dữ liệu của tất cả tech stack
exports.getAllList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const techStacks = await TechStack.find()
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalTechStack = await TechStack.count();

    res.status(200).json({ data: techStacks, total: totalTechStack });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả tech stack chưa xóa
exports.getActiveList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const techStacks = await TechStack.find({ isDelete: false })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalTechStack = await TechStack.find({ isDelete: false }).count();

    res.status(200).json({ data: techStacks, total: totalTechStack });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả tech stack đã xóa
exports.getDeletedList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const techStacks = await TechStack.find({ isDelete: true })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalTechStack = await TechStack.find({ isDelete: true }).count();

    res.status(200).json({ data: techStacks, total: totalTechStack });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy dữ liệu chi tiết của 1 tech stack
exports.getDetail = async (req, res, next) => {
  const techStackId = req.params.techStackId;

  try {
    const techStack = await TechStack.findById(techStackId);

    if (!techStack) {
      const error = new Error('Thông tin tech stack không tồn tại!');

      error.statusCode = 404;

      throw error;
    }

    res.status(200).json(techStack);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Tạo mới tech stack
exports.create = async (req, res, next) => {
  const newTechStack = {
    name: req.body.name,
    short_desc: req.body.short_desc,
    long_desc: req.body.long_desc,
    state: req.body.state,
  };

  try {
    if (!newTechStack.name) {
      const error = new Error('Tên tech stack không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newTechStack.short_desc) {
      const error = new Error('Mô tả ngắn gọn không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newTechStack.long_desc) {
      const error = new Error('Mô tả chi tiết không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newTechStack.state) {
      const error = new Error('Trạng thái không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const techStack = new TechStack(newTechStack);

    const result = await techStack.save();

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

// Chỉnh sửa tech stack
exports.edit = async (req, res, next) => {
  const techStackId = req.params.techStackId;
  const updateTechStack = {
    name: req.body.name,
    short_desc: req.body.short_desc,
    long_desc: req.body.long_desc,
    state: req.body.state,
  };

  try {
    if (!updateTechStack.name) {
      const error = new Error('Tên tech stack không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateTechStack.short_desc) {
      const error = new Error('Mô tả ngắn gọn không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateTechStack.long_desc) {
      const error = new Error('Mô tả chi tiết không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateTechStack.state) {
      const error = new Error('Trạng thái không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const result = await TechStack.findByIdAndUpdate(
      techStackId,
      updateTechStack
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

// Xóa 1 tech stack
exports.deleteOne = async (req, res, next) => {
  const techStackId = req.params.techStackId;

  try {
    const departments = await Department.find({ isDelete: false });
    const employees = await Employee.find({ isDelete: false });
    const projects = await Project.find({ isDelete: false });

    const existedProject = projects.find((p) =>
      p.techStacks.find((ts) => ts.toString() === techStackId)
    );

    if (existedProject) {
      const error = new Error(
        'Tech stack vẫn đang được sử dụng trong một dự án. Bạn không thể xóa!'
      );

      error.statusCode = 403;

      throw error;
    }

    await TechStack.findByIdAndUpdate(techStackId, {
      isDelete: true,
    });

    departments.map(async (d) => {
      const existedDepartment = d.techStacks.find(
        (ts) => ts.toString() === techStackId
      );

      if (existedDepartment) {
        await d.removeFromTechStacks(techStackId);
      }
    });

    // employees.map(async (e) => {
    //   const existedEmployee = e.techStacks.find(
    //     (ts) => ts.techStack.toString() === techStackId
    //   );

    //   if (existedEmployee) {
    //     await e.removeFromTechStacks(techStackId);
    //   }
    // });

    res.status(200).json({ message: 'Thành công xóa dữ liệu!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Xóa nhiều tech stack
exports.deleteMany = async (req, res, next) => {
  const ids = req.body.ids;

  try {
    const departments = await Department.find({ isDelete: false });
    const employees = await Employee.find({ isDelete: false });
    const projects = await Project.find({ isDelete: false });

    const existedProject = projects.find((p) =>
      p.techStacks.find((ts) => ids.indexOf(ts.toString()) > -1)
    );

    if (existedProject) {
      const error = new Error(
        'Có tech stack vẫn đang được sử dụng trong một dự án. Bạn không thể xóa!'
      );

      error.statusCode = 403;

      throw error;
    }

    ids.map(async (id) => {
      await TechStack.findByIdAndUpdate(id, {
        isDelete: true,
      });

      departments.map(async (d) => {
        const existedDepartment = d.techStacks.find(
          (ts) => ts.toString() === id
        );

        if (existedDepartment) {
          await d.removeFromTechStacks(id);
        }
      });

      // employees.map(async (e) => {
      //   const existedEmployee = e.techStacks.find(
      //     (ts) => ts.techStack.toString() === id
      //   );

      //   if (existedEmployee) {
      //     await e.removeFromTechStacks(id);
      //   }
      // });
    });

    res.status(200).json({ message: 'Thành công xóa dữ liệu!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
