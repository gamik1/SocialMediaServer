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
      console.log(imageAdded)
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


router.get(
  '/profile/:uid',
  async (req, res, next) => {
    const userProfile = await ProfileModel.findOne({ _user_Id: req.params.uid });
    // console.log(userProfile);
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      userProfile: userProfile ? userProfile : { user: req.user },
      token: req.query.secret_token
    })
  }
);


router.post(
  '/post/add',
  async (req, res, next) => {
    console.log(req.body)
    const post = req.body;
    post['post-text'] = replaceBadWords(post['post-text']);

    const newPost = await PostModel.create({ _user_Id: req.user._id, postContent: post['post-text'] });

    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      newPost: newPost != {} ? newPost : { error: " error" },
      token: req.query.secret_token
    });

    console.log(newPost)

    return newPost;
  }
);

router.get(
  '/post/detail/:id',
  async (req, res, next) => {
    console.log("===========" + req.params.id)

    const post = await PostModel.findById({ _id: req.params.id });
    console.log(post);
    res.status(200).json({
      message: 'You made it to the secure route',
      user: req.user,
      post: post ? post : { user: req.user },
      token: req.query.secret_token
    })
    return post;
  }
);

router.get(
  '/post/list',
  async (req, res, next) => {
    const posts = await PostModel.find({ 'type': 'post' }).sort({ createDate: -1 });
    console.log(posts);
    res.status(200).json({
      message: 'You made it to the secure route',
      user: req.user,
      posts: posts ? posts : { user: req.user },
      token: req.query.secret_token
    })
    return posts;
  }
);


router.post(
  '/comment/add',
  async (req, res, next) => {
    const comment = req.body;
    console.log(comment);

    comment['comment-text'] = replaceBadWords(comment['comment-text']);

    const newComment = await PostModel.create({
      _user_Id: req.user._id,
      postContent: comment['comment-text'],
      commentTo: comment['post-id'],
      type: 'comment'
    });
    await PostModel.findByIdAndUpdate({ _id: comment['post-id'] }, { $inc: { countOfComment: 1 } });

    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      newComment: newComment != {} ? newComment : { error: " error" },
      token: req.query.secret_token
    });

    console.log(newComment)

    return newComment;
  }
);


router.get(
  '/post/comments/:pid',
  async (req, res, next) => {
    const comments = await PostModel.find({ 'type': 'comment', 'commentTo': req.params.pid })
    console.log(comments);
    res.status(200).json({
      message: 'You made it to the secure route',
      user: req.user,
      comments: comments ? comments : [],
      token: req.query.secret_token
    })
    return comments;
  }
);

const badwords = ['fuck', 'shit', 'asshole', 'bitch', 'bastard', 'bloody hell', 'piss', 'dick'];

function replaceBadWords(text) {
  var value = text.trim();
  for (var i = 0; i < badwords.length; i++) {
    var reg = new RegExp(badwords[i], "gi");
    if (value.toLowerCase().indexOf(badwords[i].toLowerCase()) > -1) {
      console.log(value)
      value = value.replace(reg, "**");
    }
  }
  return value;
}



module.exports = router;