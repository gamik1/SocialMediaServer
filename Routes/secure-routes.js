const express = require('express');
const router = express.Router();
const ProfileModel = require("../Models/Profile"); 

router.post(
  '/profile',
  async (req, res, next) => {
    console.log(req.body)
    const profile = req.body; 
    
    const userProfilePosted = await ProfileModel.updateOne({_user_Id: req.user._id},{...profile},{upsert: true}) ;

    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      userProfilePosted: userProfilePosted != {} ? userProfilePosted : {error :" error"},
      token: req.query.secret_token
    });
    return userProfilePosted;
  }
);

router.get(
  '/profile',
  async (req, res, next) => {
    const userProfile = await ProfileModel.findOne({_user_Id : req.user});
    console.log(userProfile);
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      userProfile: userProfile ? userProfile : {user: req.user},
      token: req.query.secret_token
    })
  }
);

module.exports = router;