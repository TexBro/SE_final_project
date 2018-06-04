var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var user_id= ''
    if(req.user){
    user_id =req.user.user_id;
  console.log(req.user.user_id);
  }
  res.render('index', { login_check:user_id });
});

module.exports = router;
