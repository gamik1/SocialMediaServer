const mongoose = require("mongoose");

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
  likes: {
    type: String,
    required: true,
  },
});

const PostModel = mongoose.model("userPost", PostSchema);

module.exports = PostModel;
