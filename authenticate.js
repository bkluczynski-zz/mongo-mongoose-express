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
    console.log('JWT payload: ', jwtPayload);
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
