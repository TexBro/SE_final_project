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


router.get('/', function(req, res, next) {
    res.render('joinForm',{title:'Join Form!'});
});

router.post('/',function(req,res,next){
    console.log(req.body);

    var email= req.body.email;
    var pass = req.body.pass;
    var grade = req.body.chk_info;
    var fname  =req.body.fname;
    var lname = req.body.lname;
    var name = fname.concat(lname);
    var tel = req.body.phone;

    var datas = [email,pass,grade,name,tel];

    pool.getConnection(function(err,connection){
        var sql="insert into t_user(email,passwd,grade,name,tel) values(?,?,?,?,?)";
        connection.query(sql,datas,function(err,rows){
            if(err) console.error(err);
            res.redirect('/');
            connection.release()
        });
    });
});
module.exports = router;
