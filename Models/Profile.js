const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    _user_Id: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  Description: {
    type: String
  }
});


const ProfileModel = mongoose.model('userProfile', ProfileSchema);

module.exports = ProfileModel;