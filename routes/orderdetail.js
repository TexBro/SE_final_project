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
router.get('/:order_id', function(req, res, next) {
    var order_id = req.params.order_id;

    pool.getConnection(function (err, connection){
        var sqlForSelectITEM = "SELECT t_orderdetail.order_id, 5_orderdetail.odd_id, t_orderdetail.item_quantity, t_item.*\n" +
            "from t_orderdetail \n" +
            "INNER JOIN t_item \n" +
            "ON t_orderdetail.item_id = t_item.item_id AND order_id = ?;";

        connection.query(sqlForSelectITEM,order_id, function(err, rows) {
            console.log("SUPER HERO LANDING!");
            console.log("odd result...."); console.log(rows);
            res.render('orderdetail', {title: 'ORDER DETAIL', rows: rows});
            connection.release();
        });//end of query
    });//end of pool
});

/*
router.get('/cancelOrder/:order_id', function(req, res, next) {
    var order_id = req.params.order_id;

    res.render('/cancelOrder', { order_id:order_id});
});
*/

/*
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
*/

module.exports = router;