var express = require('express');
var router = express.Router();
var {isLoggedIn} = require('../helpers/util')

/* GET users listing. */
router.get('/', isLoggedIn, function (req, res, next) {
    res.render('admin/post/index', {title:"Post", user:req.session.user})
});

module.exports = router;
