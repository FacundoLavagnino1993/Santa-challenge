const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({name: {type: String}, email: { type: String}, password: { type: String}, role: { type: String }});

const usersSettings = mongoose.model(
  'Users',
  usersSchema,
);

module.exports = usersSettings;
