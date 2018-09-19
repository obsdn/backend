const mongoose = require('mongoose');

const billetSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {type: String, minlength: 10, maxlength: 50},
  post: {type: String, required: true, minlength: 50, maxlength: 200}
});

module.exports = mongoose.model('Billet', billetSchema);
