const meetupSettings = require('../../models/meetup');
const mongoose = require('mongoose');

class meetupService {
  constructor() {}

  getMeetups() {
    return new Promise((resolve, reject) => {
      meetupSettings.find({}, (err, data) => {
        if (err) {
          reject({ error: 'Error getting MongoDB data' });
        } else {
          resolve(data);
        }
      }).sort({dateMeetup: 'asc'});
    })
  }

  createMeetup(args) {
    const newMeetup = {
      name: args.name,
      users: args.users,
      dateMeetup: args.dateMeetup
    }

    return new Promise((resolve, reject) => {
      meetupSettings.create(newMeetup, (err, data) => {
        if (err) {
          reject({ error: err});
        } else {
          resolve(data);
        }
      });
    })
  }

  checkInUserToMeetup(args) {
    const meetupId = args.id;
    const user = args.user;

    return new Promise((resolve, reject) => {
      meetupSettings.updateOne({_id: meetupId}, {$addToSet: { usersCheckIn: user}}, (err, data) => {
        if (err) {
          reject({ error: err});
        } else {
          resolve(data);
        }
      });
    })
  }

  addUserToMeetup(args) {
    const meetupId = args.id;
    const user = args.user;

    return new Promise((resolve, reject) => {
      meetupSettings.updateOne({_id: meetupId}, {$addToSet: { users: user}}, (err, data) => {
        if (err) {
          reject({ error: err});
        } else {
          resolve(data);
        }
      });
    })
  }


}

module.exports = meetupService;
