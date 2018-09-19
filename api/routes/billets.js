const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const billetsController = require('../controllers/billets');

//handle incoming to get requests /billets
router.get('/all', billetsController.billets_get_all);

router.post('/create-post', billetsController.billets_create_billets);

router.get('/:billetId', checkAuth, billetsController.billets_get_billets);

router.delete('/:billetId', checkAuth, billetsController.billets_delete);

module.exports = router;
