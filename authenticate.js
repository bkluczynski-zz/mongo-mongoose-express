/* eslint no-underscore-dangle: 1 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');

const config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user => jwt.sign(
  user, config.secretKey,
  { expiresIn: 3600 },
);

const opts = {};
//  token is being extracted
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(
  opts,
  (jwtPayload, done) => {
    User.findOne(
      { _id: jwtPayload._id },
      (err, user) => {
        if (err) {
          return done(err, false);
        } else if (user) {
          return done(null, user);
        }
        return done(null, false);
      },
    );
  },
));

exports.verifyUser = passport.authenticate('jwt', { session: false });
exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json('You have successfully removed all dishes');
    next();
  } else {
    res.statusCode = 401;
    const err = new Error('You are not authorized to perform this operation');
    next(err);
  }
}

// getting a dish can be done by anybody

// deleting/editing/updating the dishes and get /users can only happen if you're an admin

// You are not authorized to perform this operation!

// authenticate.verifyUser, authenticate.verifyAdmin
// if success perform the operation
// if not You are not authorized to perform this operation!

// Deleting a specific comment is only possible by an author of a comment
// if not an author send the Error
// you are not authorized to delete the comment
