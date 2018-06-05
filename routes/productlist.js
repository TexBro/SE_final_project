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
    password: 'kim905',
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
    var CATEGORY = req.body.CATEGORY;
    var PRICE = req.body.PRICE;
    var DETAIL = req.body.DETAIL;
    var ID= req.user.user_id;

    var IMAGE = '';
    if(req.file) {
        IMAGE = req.file.originalname;
    }
    var datas = [TITLE_ID, CATEGORY, ID, PRICE, DETAIL, IMAGE];
    pool.getConnection(function(err, connection)
    {
        var sqlForInsertITEM = "insert into T_ITEM(PRODUCT_NAME, CATEGORY, USER_ID, PRODUCT_PRICE, DESCRIPTION, IMAGE1) values(?,?,?,?,?,?)";
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
router.get('/productdelete/:ITEM_ID', function(req,res,next){
    pool.getConnection(function(err,connection){
        if(err) console.error("커넥션 객체 얻어오기 에러: ",err);
        var sql = "DELETE FROM t_board WHERE ITEM_ID = ?";
        connection.query(sql, [req.params.ITEM_ID], function(err,rows){
            if(err) console.error(err);

            console.log("delete 실시 대상 : ",rows);
            //res.redirect('/productlist')
        });

        var sql2 = "DELETE FROM t_item WHERE ITEM_ID = ?";
        connection.query(sql2, [req.params.ITEM_ID], function(err,rows){
            if(err) console.error(err);

            console.log("delete 실시 대상 : ",rows);
            res.redirect('/productlist')
        });
    });
});
router.get('/productupdate/:ITEM_ID', function(req,res,next)
{

    var ITEM_ID = req.params.ITEM_ID;

    pool.getConnection(function(err,connection)
    {
        if(err) console.error("커넥션 객체 얻어오기 에러 : ", err);

        var sql = "select ITEM_ID, product_name, product_price, description, image1 from t_item where ITEM_ID=?";
        connection.query(sql, [ITEM_ID], function(err, rows)
        {
            if(err) console.error(err);
            console.log("update에서 1개 글 조회 결과 확인 : ", rows);
            res.render('productupdate', {title:"글 수정", row:rows[0]});
            connection.release();
        });


    });
});

router.post('/productupdate', upload.single('userfile'),  function(req, res, next)
{
    var ITEM_ID =req.body.ITEM_ID;
    var CATEGORY = req.body.CATEGORY;
    var PRODUCT_NAME = req.body.TITLE_ID;
    var PRODUCT_PRICE = req.body.PRICE;
    var DETAIL = req.body.DETAIL;
    var ID = req.user.user_id;
    //console.log("fasddd")
    var IMAGE = '';
    if(req.file) {
        IMAGE = req.file.originalname;
    }
    //console.log("fasddd")
    var datas = [PRODUCT_NAME, CATEGORY,ID, PRODUCT_PRICE, DETAIL, IMAGE, ITEM_ID];
    console.log(datas)
    var datas2 = [PRODUCT_NAME, ITEM_ID];
    pool.getConnection(function(err, connection)
    {
        var sql = "update t_item set product_name =?, category = ?, USER_ID = ?, product_price =?, description = ? , image1 = ? where ITEM_ID=? ";
        connection.query(sql,datas, function(err, result) {
            console.log(result);
            if (err) console.error("글 수정 중 에러 발생 : ", err);
            //res.redirect('/productlist');
            //connection.release();
        });

        var sql2 = "update t_board set TITLE =? where ITEM_ID=? ";
        connection.query(sql2,datas2, function(err, result) {
            console.log(result);
            if (err) console.error("글 수정 중 에러 발생 : ", err);
            res.redirect('/productlist');
            connection.release();
        });
    });
});

module.exports = router;
