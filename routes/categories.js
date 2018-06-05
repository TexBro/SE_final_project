var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'sw_proj3',
    password: 'hyjuki12!'
});
router.get('/',function(req, res, next){
  //res.render('../cart')
  pool.getConnection(function (err, connection){
      var sqlForSelectList = "SELECT item_id, user_id, product_name, product_price, category,discount_rate,image1,image2,image3,description,avg_star FROM t_item";
      connection.query(sqlForSelectList, function(err, rows) {
          if(err) console.error(err);
          res.render('categories', {title: 'clothes', rows:rows});
          connection.release();
      });
  });
});


router.get('/product/:id', function(req, res, next){
  var id=req.params.id;
  console.log('product/'+id);
  res.render('product/'+id);
 });
module.exports = router;



router.get('/:catego',function(req,res,next){
  var catego=req.params.catego;
  //res.render('../cart')
  pool.getConnection(function (err, connection){
      var sqlForSelectList = "SELECT item_id, user_id, product_name, product_price, category,discount_rate,image1,image2,image3,description,avg_star FROM t_item WHERE category = ?";
      connection.query(sqlForSelectList,[catego], function(err, rows) {
          if(err) console.error(err);
          console.log('\n\n\n\n\n\n'+JSON.stringify(rows));
          res.render('categories', {title: 'clothes', rows:rows});
          connection.release();
      });
  });
});
module.exports = router;
module.exports = router;

/*
router.get('/',function(req,res,next){
  //res.render('../cart')
  pool.getConnection(function (err, connection){
      var sqlForSelectList = "SELECT item_id, user_id, product_name, product_price, category,discount_rate,image1,image2,image3,description,avg_star FROM t_item";
      connection.query(sqlForSelectList, function(err, rows) {
          if(err) console.error(err);
          console.log('\n\n\n\n\n\n'+JSON.stringify(rows));
          res.render('categories', {title: 'clothes', rows:rows});
          connection.release();
      });
  });
});
module.exports = router;*/
