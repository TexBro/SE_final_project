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
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('product', { title: 'Express' });
});
module.exports = router;

router.get('/:id', function(req, res, next) {
    //console.log('\n\n\n\n\n'+id);
    var id=req.params.id;
    pool.getConnection(function (err, connection){
        var sqlForSelectList = "SELECT item_id, user_id, product_name, product_price, category,discount_rate,image1,image2,image3,description,avg_star FROM t_item WHERE item_id=?";
        var sqlForReviewList = "SELECT email,title,contents,score FROM t_review WHERE item_id = ?";
        connection.query(sqlForSelectList,[id], function(err, rows) {
            if(err) console.error(err);
            console.log('\n\n\nrows!!'+ JSON.stringify(rows));
            connection.query(sqlForReviewList,[id],function(err,results){
                console.log('\n\n\nresult!!'+JSON.stringify(results));
                res.render('product', { title: 'product', rows:rows, results : results });
            });
            connection.release();
        });
    });
});


router.post('/review_form',function(req, res, next) {
    //console.log(req.file.filename);
    var name = req.body.user_name;
    var email = req.body.user_email;
    var star = req.body.user_star;
    var text = req.body.review_form_text;
    var id=req.body.id;
    var datas = [id,email,name,text,star];
    console.log('DATA!!!!!!\n'+datas);
    pool.getConnection(function(err, connection)
    {
        var sqlForInsertBoard = "insert into t_review (item_id, email,title,contents,score) values(?,?,?,?,?)";
        connection.query(sqlForInsertBoard,datas, function(err, rows){
            if(err) console.error(err);
            console.log(JSON.stringify(rows));
            //res.redirect('/'+id);
            var getAVGScore = "Select AVG(score) AS avg_score FROM T_REVIEW WHERE item_id = ?"
            connection.query(getAVGScore,id, function(err, result){
                if(err) console.err(err);
                var setAVGscore = "UPDATE T_ITEM SET avg_star =? where item_id =?";
                var star = result[0].avg_score;
                var data = [star, id];

                connection.query(setAVGscore,data, function(err,result2){
                    if(err) console(err);

                    res.redirect('back');
                    connection.release();
                });//end of last query
            });//end of second query
        });//end of fist query
    });//end of pool
});
module.exports = router;
module.exports = router;