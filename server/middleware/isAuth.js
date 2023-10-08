'use strict';

const jwt = require('jsonwebtoken');

const User = require('../models/User');

// ==================================================

module.exports = (req, res, next) => {
  console.log(req.sessionID);
  const token = req.session.token;
  const decodedToken = jwt.decode(token, 'supersecrettoken');

  // Kiểm tra xem có token hay không
  if (!decodedToken) {
    const error = new Error('Chưa đăng nhập');

    error.statusCode = 401;

    throw error;
  }

  // Lấy dữ liệu user đang login
  User.findById(decodedToken.userId)
    .populate('profile')
    .then((user) => {
      if (!user) {
        const error = new Error('Thông tin người dùng không tồn tại');

        error.statusCode = 404;

        throw error;
      }

      req.user = user;

      next();
    })
    .catch((error) => {
      error.statusCode = 500;

      throw error;
    });
};
