// Global Imports
const express = require('express');

module.exports.expressInit = (app) => {
  app.set('view engine', 'ejs');
  app.set('views', './public/pages');
  app.use(express.static('./public/assets'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
};
