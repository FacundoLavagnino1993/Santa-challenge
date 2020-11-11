const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const routeConf = require('./routes/api-routes-list.json');
const viewRoutesBuilder = require('./routes/routes-builder')(routeConf.routes.express.view);
const authorizationMiddleware = require('../middleware/authorizationMidd');

router.use('/', authorizationMiddleware, viewRoutesBuilder);
module.exports = router;
