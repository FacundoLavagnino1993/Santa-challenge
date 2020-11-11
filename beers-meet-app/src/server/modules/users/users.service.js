const usersSettings = require('../../models/users');

class usersService {
  constructor() {}

  getUserEmail(email) {
    return new Promise((resolve, reject) => {
      usersSettings.find({"email": email}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          data.length > 0 ? resolve(data) : reject({status: 403, message: 'email or password incorrect'})
        }
      });
    })
  }

  getUsers() {
    return new Promise((resolve, reject) => {
      usersSettings.find({},'name email', (err, data) => {
        if (err) {
          reject({ error: 'Error getting MongoDB data' });
        } else {
          resolve(data);
        }
      });
    })
  }
}

module.exports = usersService;
