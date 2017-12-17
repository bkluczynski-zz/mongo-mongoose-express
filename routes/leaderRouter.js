/* eslint no-unused-vars: 1 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');

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
      .catch(err => console.log(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
      .then((leader) => {
        console.log('Leader has been entered', leader);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader);
      }, err => next(err))
      .catch(err => console.log(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on leaders');
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
      }, err => next(err))
      .catch(err => console.log(err));
  });


leaderRouter.route('/:leaderid')
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderid)
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader);
      }, err => next(err))
      .catch(err => console.log(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on leaders/ ${req.params.leaderid}`);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderid, req.body, { new: true })
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader);
      }, err => next(err))
      .catch(err => console.log(err));
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderid)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
      }, err => console.log(err))
      .catch(err => console.log(err));
  });

module.exports = leaderRouter;
