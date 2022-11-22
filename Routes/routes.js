const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const ProfileModel = require('../Models/Profile');

const router = express.Router();


router.post(
  '/others/profile',
  async (req, res, next) => {
    
    const userProfile = await ProfileModel.findOne({ _user_Id: req.body });
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      userProfile: userProfile ? userProfile : { user: req.user },
      token: req.query.secret_token
    })
  }
);


router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json({
      message: 'Signup Request Received',
      registerResponse: req.user
    });
  }
);


router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.');

            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { _id: user._id, email: user.email };
              const token = jwt.sign({ user: body }, 'TOP_SECRET');

              return res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);


module.exports = router;