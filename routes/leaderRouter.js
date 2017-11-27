const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());


leaderRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('I am going to send all the leaders now!');
    })
    .post((req, res, next) => {
        res.end('I added the leader ' + req.body.name + ' ' + req.body.description);
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
