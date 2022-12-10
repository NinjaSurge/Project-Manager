const express = require('express');
const { use } = require('../routes/projects');

const router = express.Router();

const globalWare = (req, res, next) => {
  console.log(req.method, req.path);
  next();
};

module.exports = { globalWare };
