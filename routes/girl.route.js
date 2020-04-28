var express = require('express');
var router = express.Router();
const {girlController} = require('../controllers/girl.controller')
router.get('/', girlController);

module.exports = router;