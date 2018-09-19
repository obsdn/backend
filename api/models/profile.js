const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {type: String},
  profileImage: {type: String}
});

module.exports = mongoose.model('Profile', profileSchema);
