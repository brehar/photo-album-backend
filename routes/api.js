'use strict';

var express = require('express');
var router = express.Router();

router.use('/images', require('./images'));
router.use('/albums', require('./albums'));

module.exports = router;