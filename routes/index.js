var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'sw_proj3',
    password: 'kim905'
});
/* GET home page. */
router.get('/', function(req, res, next) {
    var user_id= ''
    var grade = ''
    var name = ''
    if(req.user){
        user_id =req.user.user_id;
        grade = req.user.grade;
        name = req.user.name;
        console.log('##################'+name);
        console.log(req.user);
    }
    pool.getConnection(function(err,connection){
      var sqlForSelectList = "SELECT * FROM t_item limit 6";
      connection.query(sqlForSelectList, function(err, rows) {
          if(err) console.error(err);
          res.render('index', {login_check:user_id , grade: grade, rows:rows,name:name});
          connection.release();
    });
  });
});

module.exports = router;
