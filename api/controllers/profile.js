const mongoose = require("mongoose");

const Profile = require('../models/profile');
const checkAuth = require('../middleware/check-auth');

exports.profile_get_all = (req, res, next) => {
  Profile.find()
    .select('email username _id avatar')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        profile: docs.map(doc => {
          return {
            email: doc.email,
            username: doc.username,
            avatar: doc.avatar,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:4200/profile/' + doc._id
            }
          }
        })
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: 'no entries found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.profile_create_profile = (req, res, next) => {
  const profile = new Profile({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    avatar: req.file.path
  });
  profile
    // .findById(id)
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'created profile succesfully',
        createdProfile: {
          username: result.username,
          avatar: result.avatar,
          request: {
            type: 'GET',
            url: 'http://localhost:4200/profile/' + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}


exports.profile_get_profile = (req, res, next) => {
  const id = req.params.profileId;
  Profile.findById(id)
    .select('username _id avatar')
    .exec()
    .then(doc => {
      console.log('from database', doc);
      if (doc) {
        res.status(200).json({
          profile: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:4200/profile/'
          }
        });
      } else {
        res.status(404).json({
          message: 'no valid entry found for provided id'
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
}

exports.profile_update_profile = (req, res, next) => {
  const id = req.params.profileId;
  const updateOps = {};
  for (const ops in req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Profile.update({
      _id: id
    }, {
      $set: updateOps
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'profile updated',
        request: {
          type: 'GET',
          url: 'http://localhost:4200/profile/' + id
        }
      });
    })
    .catch(err => {
      console.log(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    });
}

exports.profile_delete = (req, res, next) => {
  const id = req.params.profileId;
  Profile.remove({
      _id: id
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'profile deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:4200/profile/',
          body: {
            username: 'String'
          }
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
}