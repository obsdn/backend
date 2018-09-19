const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: {type: Date},
  content: {type: String},
  username: {type: String}
  }, {
  versionKey: false,
  collection: "message"
});

module.exports = mongoose.model('Message', messageSchema);
