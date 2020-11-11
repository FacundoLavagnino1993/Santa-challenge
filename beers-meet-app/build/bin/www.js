
//Log app start errors
process.on('uncaughtException', (exception) => {
  console.error(exception)
});
//Log unhandled rejections
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

const config = require('../config/env');
const express = require('../config/express');
const app = express.app;
const server = express.server;

// listen on port config.port
app.set('port', config.port);
server.listen(config.port, () => {
  console.log(`server started on port ${config.port} (${config.env})`);
});

module.exports = app;
