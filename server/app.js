'use strict';

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');

const Router = require('./routes/index');

// ==================================================

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE}.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();

// Lưu cookie của current user vào MongoDB
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'cookies',
});
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.match(/[^:/]\w+\//)[0] === 'image/') {
      cb(null, __dirname + '/public/images');
    } else if (file.mimetype.match(/[^:/]\w+\//)[0] === 'audio/') {
      cb(null, __dirname + '/public/audios');
    } else {
      cb(null, __dirname + '/public/documents');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      'https://project-manager-dangtrantien.vercel.app',
      'http://localhost:3000',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(
  multer({ storage: fileStorage }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ])
);
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1);
app.use(
  session({
    secret: 'session',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      sameSite: 'none',
      secure: false,
      expires: Date.now() * 1000 * 60 * 60 * 24 * 3,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    },
  })
);

// Route api
Router(app);

// Gửi các error cho frontend
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status).json({ message: message });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to mongoDB');

    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));
