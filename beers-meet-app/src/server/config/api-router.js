const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const routeConf = require('./routes/api-routes-list.json');
const apiRoutesBuilder = require('./routes/routes-builder')(routeConf.routes.express.api);
const authorizationMiddleware = require('../middleware/authorizationMidd');

router.use('/api', authorizationMiddleware, apiRoutesBuilder);

module.exports = router;
