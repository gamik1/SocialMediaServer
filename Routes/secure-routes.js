const express = require('express');
const router = express.Router();
const UserModel = require("../Models/User");
const ProfileModel = require("../Models/Profile");
const PostModel = require("../Models/Post");
const FriendModel = require("../Models/Friend");
const EventModel = require("../Models/Event");
const multer = require('multer');
const Filter = require('bad-words');

const upload = multer({ dest: "./public/uploads" });


router.post("/upload-profile", upload.single('file'), async (req, res) => {
  try {
    console.log(req.file);
    const imageAdded = await ProfileModel.updateOne({ _user_Id: req.user._id }, { displayImage: `${req.file.filename}` }, { upsert: true });
    if (imageAdded) {
      console.log(imageAdded)
      return res.status(200).json("File uploded successfully");
    } else {
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

    const userProfilePosted = await ProfileModel.updateOne({ _user_Id: req.user._id }, { ...profile }, { upsert: true });

    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      userProfilePosted: userProfilePosted != {} ? userProfilePosted : { error: " error" },
      token: req.query.secret_token
    });
    return userProfilePosted;
  }
);

router.get(
  '/profile',
  async (req, res, next) => {
    const userProfile = await ProfileModel.findOne({ _user_Id: req.user });
    console.log(userProfile);
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      userProfile: userProfile ? userProfile : { user: req.user },
      token: req.query.secret_token
    })
  }
);


router.get(
  '/profile/:uid',
  async (req, res, next) => {
    let userProfile = await ProfileModel.findOne({ _user_Id: req.params.uid }).lean();
    // console.log(userProfile);
    userProfile = richProfile(userProfile, req.user);
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
    const filter = new Filter();
    post['post-text'] = filter.clean(post['post-text']);

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
    // console.log(posts);
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
    const filter = new Filter();
    comment['comment-text'] = filter.clean(comment['comment-text']);

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


router.get(
  '/friend/ids',
  async (req, res, next) => {
    let friend = await FriendModel.findOne({ _user_Id: req.user });
    // console.log(friend);
    res.status(200).json({
      message: 'You made it to the secure route',
      user: req.user,
      friend: friend ? friend : undefined,
      token: req.query.secret_token
    })
    return friend;
  }
);

router.get(
  '/friend/profiles',
  async (req, res, next) => {
    const friend = await FriendModel.findOne({ _user_Id: req.user });
    const profiles = await Promise.all(friend.friendIds.map(async (uid) => {
      const userProfile = await ProfileModel.findOne({ _user_Id: uid }).lean();
      const user = await UserModel.findById({ _id: userProfile._user_Id }).lean();
      delete user.password;
      const a = richProfile(userProfile, user);
      return a;
    }))
    // console.log(profiles);
    res.status(200).json({
      message: 'You made it to the secure route',
      user: req.user,
      profiles: profiles,
      token: req.query.secret_token
    })
    return friend;
  }
);


router.post(
  '/friend/add',
  async (req, res, next) => {
    // console.log(req.body)
    let err = null;

    const friendId = req.body['fid'];
    const selfId = req.user._id;

    const selfUpdate = async () => {
      let self = await FriendModel.findOne({ _user_Id: selfId });
      if (!self) {
        self = await FriendModel.create({ _user_Id: selfId, askings: [friendId] })
      } else {
        await FriendModel.findByIdAndUpdate(self._id, { $addToSet: { askings: friendId }, updateDate: new Date() })
      }
    }

    let friend = await FriendModel.findOne({ _user_Id: friendId });
    if (!friend) {
      friend = await FriendModel.create({ _user_Id: friendId, pendings: [selfId] })
      selfUpdate();
    } else if (friend.pendings.includes(selfId)) {
      err = "You've sent Friend request, please be patient."
    } else if (friend.friendIds.includes(selfId)) {
      err = 'You have added this friend.'
    } else {
      selfUpdate();
      await FriendModel.findByIdAndUpdate(friend._id, { $addToSet: { pendings: selfId }, updateDate: new Date() });
    }

    if (!err) {
      await EventModel.create({ _user_Id: friendId, askerId: selfId, ref_Ids: [friend._id] })
    }

    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      friend: err ? { error: err } : friend,
      token: req.query.secret_token
    });

    return friend;
  }
);

router.post(
  '/friend/remove',
  async (req, res, next) => {
    // console.log(req.body)

    const friendId = req.body['fid'];
    const selfId = req.user._id;

    await FriendModel.findOneAndUpdate({ _user_Id: selfId }, { $pull: { friendIds: friendId }, updateDate: new Date() })
    await FriendModel.findOneAndUpdate({ _user_Id: friendId }, { $pull: { friendIds: selfId }, updateDate: new Date() })
    await EventModel.create({ _user_Id: friendId, askerId: selfId, ref_Ids: [], eventType: 'friendRemove' })

    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      result: true,
      token: req.query.secret_token
    });

  }
);

router.post(
  '/event/friend',
  async (req, res, next) => {
    // console.log(req.body)
    const operation = req.body['operation'];
    const eventId = req.body['eventId'];
    const event = await EventModel.findById({ _id: eventId })
    // console.log(event)
    const selfId = event._user_Id
    const askerId = event.askerId

    let updateSelfClause = operation === 'reject'
      ? {
        $pull: { pendings: askerId },
        updateDate: new Date()
      } : {
        $pull: { pendings: askerId },
        $addToSet: { friendIds: askerId },
        updateDate: new Date()
      }
    let updateAskerClause = operation === 'reject'
      ? {
        $pull: { askings: selfId },
        updateDate: new Date()
      } : {
        $pull: { askings: selfId },
        $addToSet: { friendIds: selfId },
        updateDate: new Date()
      }

    const evtType = operation === 'reject' ? 'friendReject' : 'friendAccept'

    await FriendModel.findOneAndUpdate({ _user_Id: selfId }, updateSelfClause, { returnOriginal: false })
    await FriendModel.findOneAndUpdate({ _user_Id: askerId }, updateAskerClause, { returnOriginal: false })
    await EventModel.findByIdAndUpdate(eventId, { processed: true })
    await EventModel.create({ _user_Id: askerId, askerId: selfId, ref_Ids: [], eventType: evtType })

    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      result: true,
      token: req.query.secret_token
    });

  }
);

router.post(
  '/event/close',
  async (req, res, next) => {
    console.log(req.body)
    const eventId = req.body['eventId'];
    await EventModel.findByIdAndUpdate(eventId, { processed: true })

    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      result: true,
      token: req.query.secret_token
    });

  }
);

router.get(
  '/event/count',
  async (req, res, next) => {
    let c = await EventModel.count({ _user_Id: req.user, processed: false })
    console.log('count of event is ===== ' + c);
    res.status(200).json({
      message: 'You made it to the secure route',
      user: req.user,
      count: c,
      token: req.query.secret_token
    })
    return c;
  }
);

router.get(
  '/event/list',
  async (req, res, next) => {
    let events = await EventModel.find({ _user_Id: req.user, processed: false }).lean();
    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        const e = events[i];
        let userProfile = await ProfileModel.findOne({ _user_Id: e.askerId }).lean();
        const user = await UserModel.findById({ _id: e.askerId }).lean();
        delete user.password;
        userProfile = richProfile(userProfile, user);
        events[i] = {
          ...e,
          profile: userProfile
        }
      }
    }
    // console.log(events);

    res.status(200).json({
      message: 'You made it to the secure route',
      user: req.user,
      events: events,
      token: req.query.secret_token
    })
    return events;
  }
);

function richProfile(userProfile, user) {
  return userProfile.firstName
    ? {
      ...userProfile,
      email: user.email,
      displayName: userProfile.firstName + ' ' + userProfile.lastName
    }
    : {
      ...user,
      displayName: user.email.substring(0, user.email.indexOf('@')),
    }
}

module.exports = router;