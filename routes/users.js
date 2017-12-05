const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        const err = new Error(`${user.username} already exists`);
        err.status = 403;
        next(err);
      } else {
        return User.create({
          username: req.body.username,
          password: req.body.password,
        });
      }
    })
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json({
        status: 'Registration Successfull',
        user,
      });
    }, err => next(err))
    .catch(err => next(err));
});

router.post('/login', (req, res, next) => {
  if (!req.session.user) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }
    const authorization = Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString().split(':');
    const username = authorization[0];
    const password = authorization[1];

    User.findOne({ username })
      .then((user) => {
        if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-type', 'text/plain');
          res.end('You have been authenticated');
        } else if (user.password !== password) {
          const err = new Error('Your password is incorrect');
          err.statusCode = 403;
          next(err);
        } else if (!user) {
          const err = new Error(`The user ${username} does not exist`);
          err.statusCode = 403;
          next(err);
        }
      })
      .catch(err => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    res.end('You are already authenticated');
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in');
    err.status = 403;
    next(err);
  }
});


module.exports = router;
