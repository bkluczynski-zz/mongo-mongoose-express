const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('I am going to send all the promotions now!');
    })
    .post((req, res, next) => {
        res.end('I added the promotion ' + req.body.name + ' ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on promotions');
    })
    .delete((req, res, next) => {
        res.end('Delete all the promotions');
    });


promoRouter.route('/:promoid')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send the details of the promotion ' + req.params.promoid);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on promotions/' + req.params.promoid);
    })
    .put((req, res, next) => {
        res.write('Updating the promotion: ' + req.params.promoid);
        res.end('Will update the promotion ' + req.body.name + ' with details ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Delete the promotion: ' + req.params.promoid);
    });

module.exports = promoRouter;
