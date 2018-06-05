var express = require('express');
var mysql = require('mysql');

var router = express.Router();
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'sw_proj3',
    password: 'hyjuki12!'
});


/* GET users listing. */
router.get('/', function(req, res, next) {
    var user_id = req.user.user_id;
    console.log(req.user.user_id);

    pool.getConnection(function (err, connection){
        var sqlForSelectOrder = "SELECT order_id,user_id,DATE_FORMAT(order_date,\"%M %d %Y\") AS order_date ,address,total_price FROM T_ORDER WHERE user_id=?";
        connection.query(sqlForSelectOrder,user_id, function(err, rows) {

            console.log(rows);
            console.log("row 받아온거 출력!!!!!");

            if(err) console.error(err);
            console.log('\n\n\nrows!!'+ JSON.stringify(rows));

            res.render('order', { title: 'ORDER HISTORY', rows:rows});
            });
            connection.release();
        });
});

/*
router.get('/cancelOrder/:order_id', function(req, res, next) {
    var order_id = req.params.order_id;

    res.render('/cancelOrder', { order_id:order_id});
});
*/

router.post('/cancelOrder/:order_id', function(req, res, next) {
    var order_id = req.params.order_id;

    pool.getConnection(function (err, connection){
        var sqlForDeleteOrder = "DELETE FROM T_ORDER WHERE order_id = ?";
        connection.query(sqlForDeleteOrder,order_id, function(err, rows) {
            console.log("주문 취소 완료");

            if(err) console.error(err);
            console.log('\n\n\nrows!!'+ JSON.stringify(rows));

            res.redirect('/order');
        });
        connection.release();
    });
});



module.exports = router;