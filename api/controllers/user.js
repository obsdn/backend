const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

process.env.SECRET_KEY = "XKQ0H1q6abOECycCPaUgTM3Vp50h2ykY";

exports.user_signup = (req, res, next) => {
  User.find({email: req.body.email})
      .exec()
      .then(user => {
        if(user.length >= 1) {
          return res.status(409).json({
            message: 'email address already exists'
          });
        }else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
              return res.status(500).json({
                error: err
              });
            }else {
              const user = new User ({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
              });
              user
                .save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({
                    message: 'user created'
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        }
      });
}

exports.user_login = (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if(user.length < 1) {
        return res.status(401).json({
          message: 'auth failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if(err) {
          return res.status(401).json({
            message: 'auth failed'
          });
        }
        if(result) {
          const token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h"
          }
        );
          return res.status(200).json({
            message: 'auth successful',
            token: token
          });
        }
        return res.status(401).json({
          message: 'auth failed'
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.user_delete = (req, res, next) => {
  User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'user deleted'
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.user_all_users = (req, res, next) => {
  User.find()
  .select('email')
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      users: docs.map(doc => {
        return {
          email: doc.email,
          _id: doc._id,
          request: {
            type: 'GET',
            url: 'http://localhost:4200/users/' + doc._id
          }
        }
      })
    };
    if(docs.length >= 0) {
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
