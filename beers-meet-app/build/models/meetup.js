const mongoose = require('mongoose');

const meetupSchema = new mongoose.Schema({name: {type: String}, dateMeetup: { type: Date}, users: { type: Array}, usersCheckIn: { type: Array}});

const meetupSettings = mongoose.model(
  'Meetup',
  meetupSchema,
);

module.exports = meetupSettings;
