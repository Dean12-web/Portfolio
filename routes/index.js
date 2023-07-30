var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    res.render('client/index',{title:"My Portfolio"})
  } catch (error) {
    res.json(error)
  }
});

router.get('/login', function(req, res, next) {
  res.render('login',{title:"Log in"});
});

module.exports = router;
