const express = require('express');
const router = express.Router();
const config = require('../../config/env');
const UsersService = require('../users/users.service');
const usersService = new UsersService();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expirationValidate = 3600000;

const generateJwtToken = (data) => {
  const payload = {
    email: data.email,
    name: data.name,
    role: data.role
  }
  const token = jwt.sign(payload, config.envConfig.jwtKey , {
    expiresIn: expirationValidate
   });
  return token;
}

/**
* @swagger
* /api/login/authentication:
*  post:
*    description: Use to request to login app
*    parameters:
*      - in: body
*        required: true
*        name: user_body
*        schema:
*          type: object
*          properties:
*            email:
*              type: string
*            password:
*              type: string
*
*    responses:
*      '200':
*        description: login Successfully
*      '403':
*        description: email or password incorrect
*/

router.route('/authentication').post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  usersService.getUserEmail(email).then((data) => {
    [user] = data;
    return bcrypt.compare(password, user.password);
  }).then((samePassword) => {

    if (!samePassword) {
      res.status(403).send({message: 'email or password incorrect'})
    } else {
      const token = generateJwtToken(user);
      res
      .cookie('token', token, {expires: new Date(Date.now() + expirationValidate)})
      .status(200)
      .send({
        message: 'Autentication succesfull',
        token: token
      })
    }
  }).catch((error) => {
    res.status(error.status).send(error);
  });

});

module.exports = router;
