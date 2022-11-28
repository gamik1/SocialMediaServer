const mongoose = require('mongoose');
const GridFs = require('./GridFs');
const UserModel  =require('./User');

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    _user_Id: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  dob: {
    type: Date
  },
  displayImage: {
    type: Schema.Types.ObjectId,
    ref: 'GridFs'
  },
  bio: {
    type: String
  },
  profession: {
    type: String
  },
  hobby: {
    type: String
  },
});



const ProfileModel = mongoose.model('userProfile', ProfileSchema);

module.exports = ProfileModel;