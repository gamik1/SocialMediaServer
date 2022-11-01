const express = require('express');
const router = express.Router();
const ProfileModel = require("../Models/Profile"); 

router.get(
  '/profile',
  async (req, res, next) => {
    const userProfile = await ProfileModel.findOne({_user_Id : req.user});

    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      userProfile: userProfile ? userProfile : {},
      token: req.query.secret_token
    })
  }
);

module.exports = router;