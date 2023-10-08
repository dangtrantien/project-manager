'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// ==================================================

// Lấy dữ liệu của người dùng đang đăng nhập
exports.getUser = async (req, res, next) => {
  try {
    const user = await req.user;

    res.status(200).json(user);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Đăng nhập
exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const isValidEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  try {
    if (!email || !isValidEmail) {
      const error = new Error(
        'Địa chỉ email phải hợp lệ và không được để trống!'
      );

      error.statusCode = 422;

      throw error;
    }

    if (!password || password.length < 6) {
      const error = new Error(
        'Mật khẩu không được để trống và phải có ít nhất 6 ký tự!'
      );

      error.statusCode = 422;

      throw error;
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error('Địa chỉ email không đúng!');

      error.statusCode = 404;

      throw error;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      const error = new Error('Mật khẩu không đúng!');

      error.statusCode = 422;

      throw error;
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      'supersecrettoken'
    );

    req.session.token = token;

    res.status(200).json({ message: 'Đăng nhập thành công!', token: token });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Đăng ký
exports.postRegister = async (req, res, next) => {
  const displayName = req.body.displayName;
  const email = req.body.email;
  const password = req.body.password;
  const isValidEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  try {
    if (!displayName) {
      const error = new Error('Họ tên người dùng không được để trống!');

      error.statusCode = 422;

      throw error;
    }

    if (!email || !isValidEmail) {
      const error = new Error(
        'Địa chỉ email phải hợp lệ và không được để trống!'
      );

      error.statusCode = 422;

      throw error;
    }

    if (!password || password.length < 6) {
      const error = new Error(
        'Mật khẩu không được để trống và phải có ít nhất 6 ký tự!'
      );

      error.statusCode = 422;

      throw error;
    }

    const existedUser = await User.findOne({ email: email });

    if (existedUser) {
      const error = new Error('Email đã tồn tại. Mời nhập địa chỉ email khác!');

      error.statusCode = 422;

      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      displayName: displayName,
      email: email,
      password: hashedPassword,
    });

    const result = await user.save();

    res.status(200).json({ message: 'Đăng ký thành công!', data: result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Đăng xuất
exports.getLogout = (req, res, next) => {
  // Xóa cookie của current user
  req.session.destroy((err) => {
    console.log(err);

    res.status(200).json({ message: 'Người dùng đã đăng xuất!' });
  });
};
