const express = require('express');
const routes = express.Router();
const config = require('../config/env');
const jwt = require('jsonwebtoken');
const apiBaseUrl = '/api';

const whiteList = ['/login/authentication', '/login'];


const verifyToken = (req, res, next, token) => {
  jwt.verify(token, config.envConfig.jwtKey , (err, decoded) => {
    if (err){
      if (req.baseUrl === '/api') {
        if (err.expiredAt - Date.now() < 0) {
          res.status(403).send({message: 'token expired'});
        } else {
          res.status(403).send({message: 'token invalid'});
        }
      } else {
          res
            .clearCookie('token')
            .redirect(`http://${req.headers.host}/login`);
      }
    } else {
      req.user = decoded;
      next();
    };
  });
}

function authorizationMiddleware (req, res, next) {
  if (!whiteList.includes(req.url)) {
    const token = req.headers['access-token'];
    if (token) {
      return verifyToken(req, res, next, token);
    } else if (req.cookies.token) {
      const coockie = req.cookies['token'];
      return verifyToken(req, res, next, coockie);
    }  else {
      if (req.baseUrl === '/api') {
        res.status(403).send({message: 'access-token is required'});
      } else {
        res.redirect(`http://${req.headers.host}/login`);
      }
    }
  } else {
    next();
  }
}

module.exports = authorizationMiddleware;
