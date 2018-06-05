var express = require('express');
var router = express.Router();

var session = require('express-session');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;;

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'sw_proj3',
    password: 'conagra1'
});

router.get('/', function(req,res,next){
    res.render('login', { title: 'Express' })
});


router.post('/',passport.authenticate('local-login',{
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
}));


//사용자 인증 성공시 호출
passport.serializeUser(function(user,done){
    console.log('serializeUser() 호출');
    console.dir(user);

    done(null,user);
});

//패스포트 로그인 설정

passport.use('local-login',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass',
    passReqToCallback: true
},  function(req,email,password,done){
    pool.getConnection(function(err,connection) {
        var email = req.body.email;
        var passwd = req.body.pass;
        connection.query('select *from `t_user` where `email` = ?', email, function (err, result) {
            console.log(result);
            if (err) {
                console.log('err :' + err);
                return done(false, null);
            } else {
                if (result.length === 0) {
                    console.log('해당 유저가 없습니다');
                    return done(false, null);
                } else {
                    if (passwd != result[0].passwd) {
                        console.log('패스워드가 일치하지 않습니다');
                        return done(false, null);
                    } else {
                        console.log('로그인 성공');
                        return done(null, {
                            user_id: result[0].user_id,
                            grade:result[0].grade
                        });
                    }
                }
            }
        });
    });
}));


//사용자 인증 이후 사용자 요청이 있을 때마다 호출
passport.deserializeUser(function(user,done){
    console.log('deserializeUser() 호출');

    console.log(user);
    done(null,user);
});

function isLoggedIn(req,res,next){
    console.log("isloggedIN 미들웨어 호출");

    if(req,isAuthenticated()){
        return next();
    }

    res.redirect('/');
}


//로그인 접근 시 권환 확인 함수

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

//로그아웃 함수
router.get('/logout', function (req, res) {
    req.logout();
    console.log("로그아웃 되었습니다.");
    res.redirect('/');
});

module.exports = router;