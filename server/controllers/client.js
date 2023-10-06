'use strict';

const Client = require('../models/Client');

// ==================================================

// Lấy danh sách dữ liệu của tất cả khách hàng
exports.getAllList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const clients = await Client.find()
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalClient = await Client.count();

    res.status(200).json({ data: clients, total: totalClient });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả khách hàng chưa xóa
exports.getActiveList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const clients = await Client.find({ isDelete: false })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalClient = await Client.find({ isDelete: false }).count();

    res.status(200).json({ data: clients, total: totalClient });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy danh sách dữ liệu của tất cả khách hàng đã xóa
exports.getDeletedList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const clients = await Client.find({ isDelete: true })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalClient = await Client.find({ isDelete: true }).count();

    res.status(200).json({ data: clients, total: totalClient });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Lấy dữ liệu chi tiết của 1 khách hàng
exports.getDetail = async (req, res, next) => {
  const clientId = req.params.clientId;

  try {
    const client = await Client.findById(clientId);

    if (!client) {
      const error = new Error('Thông tin khách hàng không tồn tại!');

      error.statusCode = 404;

      throw error;
    }

    res.status(200).json(client);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Tạo mới khách hàng
exports.create = async (req, res, next) => {
  const newClient = {
    name: req.body.name,
    short_desc: req.body.short_desc,
    long_desc: req.body.long_desc,
    priority: req.body.priority,
    state: req.body.state,
  };

  try {
    if (!newClient.name) {
      const error = new Error('Tên khách hàng không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newClient.short_desc) {
      const error = new Error('Mô tả ngắn gọn không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!newClient.long_desc) {
      const error = new Error('Mô tả chi tiết không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (
      !newClient.priority ||
      newClient.priority < 1 ||
      newClient.priority > 5
    ) {
      const error = new Error(
        'Mức độ ưu tiên không được để trống và chỉ trong khoảng từ 1-5!'
      );

      error.statusCode = 422;

      throw error;
    }

    if (!newClient.state) {
      const error = new Error('Trạng thái không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const client = new Client(newClient);

    const result = await client.save();

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

// Chỉnh sửa khách hàng
exports.edit = async (req, res, next) => {
  const clientId = req.params.clientId;
  const updateClient = {
    name: req.body.name,
    short_desc: req.body.short_desc,
    long_desc: req.body.long_desc,
    priority: req.body.priority,
    state: req.body.state,
  };

  try {
    if (!updateClient.name) {
      const error = new Error('Tên khách hàng không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateClient.short_desc) {
      const error = new Error('Mô tả ngắn gọn không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!updateClient.long_desc) {
      const error = new Error('Mô tả chi tiết không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (
      !updateClient.priority ||
      +updateClient.priority < 1 ||
      +updateClient.priority > 5
    ) {
      const error = new Error(
        'Mức độ ưu tiên không được để trống và chỉ trong khoảng từ 1-5!'
      );

      error.statusCode = 422;

      throw error;
    }

    if (!updateClient.state) {
      const error = new Error('Trạng thái không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    const result = await Client.findByIdAndUpdate(clientId, updateClient);

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

// Xóa 1 khách hàng
exports.deleteOne = async (req, res, next) => {
  const clientId = req.params.clientId;

  try {
    await Client.findByIdAndUpdate(clientId, {
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

// Xóa nhiều khách hàng
exports.deleteMany = async (req, res, next) => {
  const ids = req.body.ids;

  try {
    ids.map(
      async (id) =>
        await Client.findByIdAndUpdate(id, {
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
