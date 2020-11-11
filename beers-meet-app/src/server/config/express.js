const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./api-router');
const viewRoutes = require('./view-router');
const app = express();
const server = require('http').Server(app);
const rootPath = path.normalize(`${__dirname}/..`);
const config = require('./env');
const cookieParser = require('cookie-parser')
const headersManagerMiddleware = require('../middleware/headersManager');
const authorizationMiddleware = require('../middleware/authorizationMidd');

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const packageData = require('../../package.json');
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: packageData.version,
      title: "BeerMeetup API",
      description: "BeerMeetup API Information",
      contact: {
        name: "Facundo Lavagnino"
      },
      servers: ["http://localhost:3200"]
    }
  },
  apis: [path.join(rootPath, '/modules/**/*.js')]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


require('./mongo');

app.use(
  bodyParser.json({
    type: ['json', 'application/csp-report'],
  }),
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// enable CORS - Cross Origin Resource Sharing
const cors = require('cors');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set('views', path.join(__dirname, ''));
app.set('jwtKey', config.key);

app.use(cors());
app.use(cookieParser())

app.use('/dist/', express.static(path.join(rootPath, '../dist')));
app.use('/assets/', express.static(path.join(rootPath, 'assets')));
app.use('/api/', headersManagerMiddleware, authorizationMiddleware);
app.use('/', apiRoutes, viewRoutes);


module.exports = {
  app,
  server,
};
