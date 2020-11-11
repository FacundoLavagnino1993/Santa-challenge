const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const usersSettings = require('../../models/users');
const UsersService = require('../users/users.service');
const usersService = new UsersService();

/**
* @swagger
* /api/users:
*  get:
*    description: Use to request to get all users
*    parameters:
*      - name: access-token
*        in: header
*        description: token of a client
*        required: true
*        schema:
*          type: string
*          format: string
*    responses:
*      '200':
*        description: Successfully retrieved users
*      '404':
*        description: users not found
*/

router.route('/').get((req, res) => {
  usersService.getUsers().then((response) => {
    res.send(response)
  }).catch((error) => {
    res.status(500).send(error);
  })
});


module.exports = router;
