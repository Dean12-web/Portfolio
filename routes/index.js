var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('client/index',{title:"My Portfolio"});
});
router.get('/login', function(req, res, next) {
  res.render('login',{title:"Log in"});
});

module.exports = router;
