var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactRouter=require('./routes/contact');
var categoriesRouter=require('./routes/categories');
var checkoutRouter=require('./routes/checkout');
var cartRouter=require('./routes/cart');
var productRouter=require('./routes/product');
var joinForm = require('./routes/joinForm');
var list =require('./routes/productlist');
var write = require('./routes/productlist');

//login 세션 처리부
var login = require('./routes/login');


//login 세션 설정 및 처리부
var passport = require('passport') //passport module add
    , LocalStrategy = require('passport-local').Strategy;
var cookieSession = require('cookie-session');
var flash = require('connect-flash');

//login 세션 심화
var mysql_dbc = require('./commons/db_con.js')();
var connection = mysql_dbc.init();

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'node_modules')));//session용 app.use
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    keys: ['node_yun'],
    cookie: {
        maxAge: 1000 * 60 * 60 // 유효기간 1시간
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/index',indexRouter);
app.use('/users', usersRouter);
app.use('/contact',contactRouter);
app.use('/categories',categoriesRouter);
app.use('/checkout',checkoutRouter);
app.use('/cart',cartRouter);
app.use('/product',productRouter);
app.use('/join',joinForm);
app.use('/login',login);
app.use('/productlist', list);
app.use('./productwrite', write);
app.use('/cart',express.static('public'));
app.use('/product',express.static('public'));
app.use('/categories',express.static('public'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
