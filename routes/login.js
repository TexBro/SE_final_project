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
    password: 'hyjuki12!'
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
                            user_id: result[0].user_id
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


router.post('/', function (req, res, next) {
    var
        user_email = req.body.email,
        password =   req.body.pass;

    console.log(req.body);
    pool.getConnection(function(err,connection){
        connection.query('select *from `t_user` where `email` = ?', user_email, function (err, result) {
            console.log(result);

            if (err) {
                console.log(err);
            } else {
                if (result.length === 0) {
                    res.json({success: false, msg: '해당 유저가 존재하지 않습니다.'})
                } else {
                    console.log(password);
                    console.log(result[0].pass);
                    //if (!bcrypt.compareSync(password, result[0].passwd)) { //해싱 비교 보류
                    if(password!=result[0].passwd){
                        res.json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
                    } else {
                        console.log("로그인 성공!");
                        res.redirect('/');
                    }
                }
            }
        });
    });
});


passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, username, password, done) {
    if(username === 'user001' && password === 'password'){
        return done(null, {
            'user_id': username,
        });
    }else{
        return done(false, null)
    }
}));

/*
//로그인 성공 시, 사용자 정보를 Session에 저장
passport.serializeUser(function (user, done) {
    done(null, user)
});

//페이지 접근 시 마다 세션정보를 추가
passport.deserializeUser(function (user, done) {
    done(null, user);
});
*/

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