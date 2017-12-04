const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
  .get((req, res, next) => {
    Leaders.find({})
      .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leaders);
      }, err => next(err))
      .catch(err => console.log(err))
  })
  .post((req, res, next) => {
    Leaders.create(req.body)
      .then((leader) => {
        console.log('Leader has been entered', leader);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader);
      }, err => next(err))
      .catch(err => console.log(err));
  })
  .put((req, res, next) => {
      res.statusCode = 403;
      res.end('PUT operation not supported on leaders');
  })
  .delete((req, res, next) => {
      res.end('Delete all the leaders');
  });


leaderRouter.route('/:leaderid')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send the details of the leader ' + req.params.leaderid);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on leaders/' + req.params.leaderid);
    })
    .put((req, res, next) => {
        res.write('Updating the leader: ' + req.params.leaderid);
        res.end('Will update the leader ' + req.body.name + ' with details ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Delete the leader: ' + req.params.leaderid);
    });

module.exports = leaderRouter;
