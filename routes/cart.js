var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cart', { title: 'Express' });
});

router.post('/checkout',function(req,res){
  var newID=req.body.ID;
  res.redirect('/checkout')
});

module.exports = router;
