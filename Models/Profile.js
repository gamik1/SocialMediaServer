const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    _user_Id: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  displayImage: {
    type: String
  },
  bio: {
    type: String
  },
  profession: {
    type: String
  },
  hobby: {
    type: String
  }
});



const ProfileModel = mongoose.model('userProfile', ProfileSchema);

module.exports = ProfileModel;