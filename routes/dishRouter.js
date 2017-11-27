const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('I am going to send all the dishes now!');
    })
    .post((req, res, next) => {
        res.end('I added the dish ' + req.body.name + ' ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on dishes');
    })
    .delete((req, res, next) => {
        res.end('Delete all the dishes');
    });


dishRouter.route('/:dishid')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send the details of the dish ' + req.params.dishid);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on dishes/' + req.params.dishid);
    })
    .put((req, res, next) => {
        res.write('Updating the dish: ' + req.params.dishid);
        res.end('Will update the dish ' + req.body.name + ' with details ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Delete the dish: ' + req.params.dishid);
    });

module.exports = dishRouter;
