var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {
  var id=req.params.id;
  console.log(id);
  res.render('cart', { title: 'Express' });
});

module.exports = router;
