const axios = require('axios');
class ForecastService {
  constructor() {}

  getForecast(args) {
      return new Promise((resolve, reject) => {
        axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=-34.6083&lon=-58.3712&exclude=hourly,minutely,current&appid=798e6ee81e2acf88dc3f3a40f0500dc3&units=metric&lang=es`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      })
  }
}

module.exports = ForecastService;
