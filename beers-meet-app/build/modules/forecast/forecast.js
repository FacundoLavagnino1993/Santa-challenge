const express = require('express');
const router = express.Router();
const ForecastService = require('./forecast.service');
const forecastService = new ForecastService();

/**
* @swagger
* /api/forecast/forecast:
*  get:
*    description: Use to request to get forecast
*    parameters:
*      - name: access-token
*        in: header
*        description: token of a client
*        required: true
*        schema:
*          type: string
*          format: string
*      - in: query
*        name: lat
*        default: -34.6083
*      - in: query
*        name: long
*        default: -34.6083
*    responses:
*      '200':
*        description: Successfully retrieved forecast
*      '404':
*        description: forecast not found
*/

router.route('/forecast').get((req, res) => {
  forecastService.getForecast(req.query)
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  })
});

module.exports = router;
