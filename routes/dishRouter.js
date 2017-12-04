const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
  .get((req, res, next) => {
    Dishes.find({})
      .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dishes);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        console.log('Dish Created', dish);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
      }, err => next(err))
      .catch(err => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on dishes');
  })
  .delete((req, res, next) => {
    Dishes.remove({})
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
      }, err => next(err))
      .catch(err => next(err));
  });


dishRouter.route('/:dishid')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishid)
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on dishes/' + req.params.dishid);
  })
  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishid, {
      $set: req.body
    }, { new: true })
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishid)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
      }, err => next(err))
      .catch(err => next(err));
  });

dishRouter.route('/:dishid/comments')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishid)
      .then((dish) => {
        if (dish) {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json(dish.comments);
        } else {
          const err = new Error(`Dish ${req.params.id} does not exist`);
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    Dishes.findById(req.params.dishid)
      .then((dish) => {
        if (dish) {
          dish.comments.push(req.body);
          dish.save()
            .then((dishWithComments) => {
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(dishWithComments);
            }, err => console.log(err));
        } else {
          const err = new Error(`Dish ${req.params.dishid} does not exist`);
          err.status = 404;
          return next(err);
        }
        console.log('Comment created', dish);
      }, err => next(err))
      .catch(err => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /dishes/${req.params.dishid}/comments`);
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishid)
      .then((dish) => {
        if (dish) {
          for (let i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
          }
          console.log('dish, comments', dish.comments);
          dish.save()
            .then((dishWithoutComments) => {
              console.log('dish', dishWithoutComments);
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(dishWithoutComments);
            }, err => console.log(err));
        } else {
          const err = new Error(`Dish ${req.params.dishid} does not exist`);
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  });


dishRouter.route('/:dishid/comments/:commentid')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishid)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentid)) {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json(dish.comments.id(req.params.commentid));
        } else if (dish === null) {
          const err = new Error(`Dish ${req.params.dishid} does not exist`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`comment ${req.params.commentid} does not exist`);
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/ ${req.params.dishid}/comments/${req.params.commentid}`);
  })
  .put((req, res, next) => {
    Dishes.findById(req.params.dishid)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentid)) {
          if (req.body.rating) {
            dish.comments.id(req.params.commentid).rating = req.body.rating;
          }
          if (req.body.comment) {
            dish.comments.id(req.params.commentid).comment = req.body.comment;
          }
          dish.save()
            .then((dishSaved) => {
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(dishSaved);
            }, err => console.log(err));
        } else if (dish === null) {
          const err = new Error(`Dish ${req.params.dishid} does not exist`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`comment ${req.params.commentid} does not exist`);
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishid)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentid)) {
          dish.comments.id(req.params.commentid).remove();
          dish.save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(dish);
            }, err => next(err));
        } else if (dish === null) {
          const err = new Error(`Dish ${req.params.dishid} does not exist`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`comment ${req.params.commentid} does not exist`);
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  });

module.exports = dishRouter;
