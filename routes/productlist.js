var express = require('express');
var router = express.Router();


var multer = require('multer');
var _storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: _storage})
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'sw_proj3',
    password: 'conagra1',
    multipleStatements:true
});

router.get('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var sqlForSelectList = "SELECT BOARD_ID, ITEM_ID, TITLE FROM T_BOARD";
        connection.query(sqlForSelectList, function (err, rows) {
            if (err) console.error(err);
            console.log(JSON.stringify(rows));
            res.render('productlist', {title: 'Express', rows:rows});
            connection.release();
        });
    });
});
module.exports = router;
router.get('/productwrite', function(req, res, next) {
    res.render('productwrite', {title : "상품 등록"});

});

router.post('/productwrite', upload.single('userfile'), function(req, res, next) {
    var TITLE_ID = req.body.TITLE_ID;
    var PRICE = req.body.PRICE;
    var DETAIL = req.body.DETAIL;
    //var IMAGE = req.body.IMAGE;
    var IMAGE = '';
    if(req.file) {
        img = req.file.originalname;
    }
    var datas = [TITLE_ID, PRICE, DETAIL, IMAGE];

    pool.getConnection(function(err, connection)
    {
        var sqlForInsertITEM = "insert into T_ITEM(PRODUCT_NAME, PRODUCT_PRICE, DESCRIPTION, IMAGE1) values(?,?,?,?)";
        connection.query(sqlForInsertITEM,datas, function(err, rows){
            if(err) console.error(err);
            console.log(JSON.stringify(rows));
        });
        ///////////////////////////////////////////////
        var sqlForInsertBOARD = "SELECT item_id from t_item where product_name = ?";
        connection.query(sqlForInsertBOARD, TITLE_ID, function(err, rows){
            if(err) console.error(err);
            console.log(JSON.stringify(rows));
            var item_id = rows[0].item_id;
            var sqlForInsert = "insert into T_BOARD(ITEM_ID, TITLE) values(?,?)"
            connection.query(sqlForInsert, [item_id, TITLE_ID], function(err, rows){
                if(err) console.error(err);
                console.log(JSON.stringify(rows));
                res.redirect('/productlist');
                connection.release();
            });
        });



    });
});

module.exports = router;