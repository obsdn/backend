const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProfileController = require('../controllers/profile');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    cb(null, new Date().toISOString() + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    //new Error('jpg or png') instead of null but it's not working
        cb(null, true);
  }else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    filesize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

//handle incoming to get requests /profile
router.get('/', ProfileController.profile_get_all);

router.post('/create-profile', upload.single('profileImage'), ProfileController.profile_create_profile);

router.get('/:profileId', ProfileController.profile_get_profile);

//change data in database
router.patch('/:profileId', checkAuth, ProfileController.profile_update_profile);

//delete with the id
router.delete('/:profileId', checkAuth, ProfileController.profile_delete);

module.exports = router;
