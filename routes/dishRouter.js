/* eslint no-unused-vars: 1 */
/* eslint no-underscore-dangle: 1 */
/* eslint no-param-reassign: 1 */

const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
//  gate open for getting info
  .get((req, res, next) => {
    Dishes.find({})
      .populate('comments.author')
      .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dishes);
      }, err => next(err))
      .catch(err => next(err));
  })
  //  authenticate the user in case the post method is needed
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        console.log('Dish Created', dish);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
      }, err => next(err))
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on dishes');
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
      .populate('comments.author')
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on dishes/ ${req.params.dishid}`);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishid, {
      $set: req.body,
    }, { new: true })
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
      .populate('comments.author')
      .then((dish) => {
        if (dish) {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json(dish.comments);
        } else {
          const err = new Error(`Dish ${req.params.id} does not exist`);
          err.status = 404;
          next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishid)
      .then((dish) => {
        if (dish) {
          req.body.author = req.user._id;
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
          next(err);
        }
        console.log('Comment created', dish);
      }, err => next(err))
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /dishes/${req.params.dishid}/comments`);
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishid)
      .then((dish) => {
        if (dish) {
          for (let i = (dish.comments.length - 1); i >= 0; i -= 1) {
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
          next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  });


dishRouter.route('/:dishid/comments/:commentid')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishid)
      .populate('comments.author')
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentid)) {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json(dish.comments.id(req.params.commentid));
        } else if (dish === null) {
          const err = new Error(`Dish ${req.params.dishid} does not exist`);
          err.status = 404;
          next(err);
        } else {
          const err = new Error(`comment ${req.params.commentid} does not exist`);
          err.status = 404;
          next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/ ${req.params.dishid}/comments/${req.params.commentid}`);
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishid)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentid)) {
          if (req.user._id.equals(dish.comments.id(req.params.commentid).author)) {
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
          } else {
            res.statusCode = 401;
            const err = new Error('You are not authorized to perform this operation');
            next(err);
          }
        } else if (dish === null) {
          const err = new Error(`Dish ${req.params.dishid} does not exist`);
          err.status = 404;
          next(err);
        } else {
          const err = new Error(`comment ${req.params.commentid} does not exist`);
          err.status = 404;
          next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishid)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentid)) {
          if (req.user._id.equals(dish.comments.id(req.params.commentid).author)) {
            console.log('comment IS', dish.comments.id(req.params.commentid));
            dish.comments.id(req.params.commentid).remove();
            dish.save()
              .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(response);
              }, err => next(err));
          } else {
            res.statusCode = 401;
            const err = new Error('You are not authorized to perform this operation');
            next(err);
          }
        } else if (dish === null) {
          const err = new Error(`Dish ${req.params.dishid} does not exist`);
          err.status = 404;
          next(err);
        } else {
          const err = new Error(`comment ${req.params.commentid} does not exist`);
          err.status = 404;
          next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  });

module.exports = dishRouter;
