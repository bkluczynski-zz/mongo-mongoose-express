const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
  .get((req, res, next) => {
    Promotions.find({})
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotions);
      }, err => next(err))
      .catch(err => console.log(err));
  })
  .post((req, res, next) => {
    Promotions.create(req.body)
      .then((promotion) => {
        console.log('Promotion has been entered', promotion);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotion);
      }, err => next(err))
      .catch(err => console.log(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on promotions');
  })
  .delete((req, res, next) => {
    Promotions.remove({})
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
      }, err => next(err))
      .catch(err => console.log(err));
  });


promoRouter.route('/:promotionid')
  .get((req, res, next) => {
    Promotions.findById(req.params.promotionid)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotion);
      }, err => next(err))
      .catch(err => console.log(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on promotions/' + ${req.params.promotionid}`);
  })
  .put((req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promotionid, req.body, { new: true })
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotion);
      }, err => next(err))
      .catch(err => console.log(err));
  })
  .delete((req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promotionid)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
      }, err => console.log(err))
      .catch(err => console.log(err));
  });

module.exports = promoRouter;
