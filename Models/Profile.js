const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    _user_Id: {
        type: Schema.Types.ObjectId, ref: 'User'
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
  },
});



const ProfileModel = mongoose.model('userProfile', ProfileSchema);

module.exports = ProfileModel;