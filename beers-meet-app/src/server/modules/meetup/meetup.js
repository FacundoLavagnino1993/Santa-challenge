const express = require('express');
const router = express.Router();
const MeetupService = require('./meetup.service');
const meetupService = new MeetupService();

/**
* @swagger
* /api/meetup:
*  get:
*    description: Use to request to get all meetups
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
*        description: Successfully retrieved meetups
*      '404':
*        description: meetups is not found
*/

router.route('/').get((req, res) => {
  meetupService.getMeetups()
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    res.status(500).send(error);
  })
});

/**
* @swagger
* /api/meetup/create:
*  post:
*    description: Use to request to create meetup
*    parameters:
*      - name: access-token
*        in: header
*        description: token of a client
*        required: true
*        schema:
*          type: string
*          format: string
*      - in: user
*        name: user_role
*        description: field contain user role
*        required: true
*        schema:
*          type: string
*      - in: body
*        name: new_meetup
*        schema:
*          type: object
*          properties:
*            name:
*              type: string
*            users:
*              type: array
*              items:
*                type: object
*                properties:
*                  name:
*                    type: string
*                  email:
*                    type: string
*            dateMeetup:
*              type: string
*
*
*    responses:
*      '200':
*        description: update Successfully
*      '404':
*        description: forecast not found
*/
router.route('/create').post((req, res) => {
  if (req.user.role === 'admin') {
    meetupService.createMeetup(req.body).then((response) => {
      res.json(response)
    }).catch((error) => {
      res.status(500).send(error)
    })
  } else {
    res.status(403).send({message: 'Access denied'})
  }
});

/**
* @swagger
* /api/meetup/add-user:
*  put:
*    description: Use to request to add users to checkin meet or inscript meet, depends actions param
*    parameters:
*      - name: access-token
*        in: header
*        description: token of a client
*        required: true
*        schema:
*          type: string
*          format: string
*      - in: body
*        name: user_body
*        schema:
*          type: object
*          properties:
*            action:
*              type: string
*            id:
*              type: string
*            user:
*              type: array
*              items:
*                type: object
*                properties:
*                  name:
*                    type: string
*                  email:
*                    type: string
*
*    responses:
*      '200':
*        description: update Successfully
*      '404':
*        description: users not found
*/

router.route('/add-user').put((req, res) => {

  if (req.body.action === 'CHECK_IN') {
    meetupService.checkInUserToMeetup(req.body).then((response) => {
      res.json(response)
    }).catch((error) => {
      res.status(500).send(error)
    });
  } else if (req.body.action === 'INSCRIPT') {
    meetupService.addUserToMeetup(req.body).then((response) => {
      res.json(response)
    }).catch((error) => {
      res.status(500).send(error)
    });
  } else {
    res.status(404).send();
  }

});
module.exports = router;
