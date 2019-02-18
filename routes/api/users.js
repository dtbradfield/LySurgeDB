let mongoose = require('mongoose');
let router = require('express').Router();
let passport = require('passport');
let user = mongoose.model('User');
let auth = require('../auth');




module.exports = router;