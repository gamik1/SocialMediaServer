const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
  _user_Id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true
  },
  friendIds: [String],
  pendings: [String],
  askings: [String],
  createDate: {
    type: Date,
    default: new Date()
  },
  updateDate: {
    type: Date,
    default: new Date()
  },
});

const FriendModel = mongoose.model("friend", FriendSchema);

module.exports = FriendModel;
