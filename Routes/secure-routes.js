const express = require('express');
const router = express.Router();
const ProfileModel = require("../Models/Profile"); 
const PostModel = require("../Models/Post"); 
const multer = require('multer');

const upload = multer({dest: "./public/uploads"});


router.post("/upload-profile", upload.single('file'),async (req, res) => {
  try {
    console.log(req.file);
    const imageAdded = await ProfileModel.updateOne({_user_Id: req.user._id},{displayImage: `${req.file.filename}`},{upsert: true});
    if(imageAdded){
      return res.status(200).json("File uploded successfully"); 
    }else{
      return res.status(200).json("File not uploded");
    }
    
  } catch (error) {
    console.error(error);
  }
});

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


router.post(
  '/post/add',
  async (req, res, next) => {
    console.log(req.body)
    const post = req.body; 
    
    const newPost = await PostModel.create({_user_Id: req.user._id, postContent: post['post-text']}) ;

    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      newPost: newPost != {} ? newPost : {error :" error"},
      token: req.query.secret_token
    });

    console.log(newPost)

    return newPost;
  }
);

router.get(
  '/post/list',
  async (req, res, next) => {
    const posts = await PostModel.find({});
    console.log(posts);
    res.status(200).json({
      message: 'You made it to the secure route',
      user: req.user,
      posts: posts ? posts : {user: req.user},
      token: req.query.secret_token
    })
    return posts;
  }
);




module.exports = router;