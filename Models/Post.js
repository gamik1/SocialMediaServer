const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  _user_Id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  postContent: {
    type: String,
    required: true,
  },
  postImage: {
    type: Schema.Types.ObjectId,
    ref: 'GridFs'
  },
  likes: {
    type: [Schema.Types.ObjectId],
    required: false,
  },
  createDate: {
    type: Date,
    default: new Date()
  },
  countOfComment: {
    type: Number,
    default: 0
  },
  countOfLike: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: 'post',
  },
  commentTo: {
    type: Schema.Types.ObjectId,
    ref: "userPost",
  },
});

const PostModel = mongoose.model("userPost", PostSchema);

module.exports = PostModel;
