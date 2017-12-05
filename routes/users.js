/* eslint no-unused-vars: 1 */
/* eslint no-underscore-dangle: 1 */

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-type', 'application/json');
        res.json({ err });
      } else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({
            success: true,
            status: 'Registration Successfull',
          });
        });
      }
    },
  );
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  //  getting the token upon successfull login with id that is being mounted on
  //  the user by passport
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-type', 'application/json');
  //  passing the token back to the client to extract it upon receiving res
  //  token will be passed to headers of every subsequent request to the server
  res.json({
    success: true,
    status: 'You are successfully logged in!',
    token,
  });
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
