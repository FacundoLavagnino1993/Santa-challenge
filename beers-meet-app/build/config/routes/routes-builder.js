/**
 * Routes Builder
 * @module routes-builder
 */

const express = require('express');
const path = require('path');
const config = require('../env');

/**
 * Builds all application routes definitions on routes-builder-conf.json
 * @param {array} modules_path routes definition
 *
 */
module.exports = function (modules_path) {
  // Build sub router and return to use as middleware
  const appRouter = express.Router();

  // Analyze every folder looking for api controllers/routes

  modules_path.forEach((definition) => {
    if (typeof definition === 'string') {
      let file = definition;
      const filePath = path.join(config.root, file);
      const routeFile = require(filePath);
      file = file.split('/');
      const endpoint = file[file.length - 2].replace('.js', ''); //eslint-disable-line no-magic-numbers
      appRouter.use(`/${endpoint}/`, routeFile);
    } else if (definition !== null && typeof definition === 'object') {
      const file = definition.file;
      const filePath = path.join(config.root, file);
      const routeFile = require(filePath);
      appRouter.use(`${definition.endpoint}`, routeFile);
    }
  });
  return appRouter;
};
