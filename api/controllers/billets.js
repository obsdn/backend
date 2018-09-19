const mongoose = require("mongoose");

const Billet = require('../models/billets');

exports.billets_get_all = (req, res, next) => {
  Billet.find()
    .select()
    .populate()
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        billets: docs.map(doc => {
          return {
            _id: doc._id,
            title: doc.title,
            post: doc.post,
            request: {
              type: 'GET',
              url: 'http://localhost:4200/billets' + doc._id
            }
          }
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
}

exports.billets_create_billets = (req, res, next) => {
  new Billet({
      _id: mongoose.Types.ObjectId(),
      title: req.body.title,
      post: req.body.post
    }).save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "billet stored",
        createdBillet: {
          _id: result._id,
          title: result.title,
          post: result.post
        },
        request: {
          type: "GET",
          url: "http://localhost:4200/billets/" + result._id
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

exports.billets_get_billets = (req, res, next) => {
  Billet.findById(req.params.billetId)
    .populate('product')
    .exec()
    .then(billet => {
      if (!billet) {
        return res.status(404).json({
          message: 'billet not found'
        });
      }
      res.status(200).json({
        billet: billet,
        request: {
          type: 'GET',
          url: 'http://localhost:4200/billets'
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
}

exports.billets_delete = (req, res, next) => {
  Billet.remove({
      _id: req.params.billetsId
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'billets deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:4200/billets',
          body: {
            productId: 'ID',
            quantity: 'Number'
          }
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
}