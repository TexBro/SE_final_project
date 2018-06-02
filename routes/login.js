var express = require('express');
var router = express.Router();

router.get('/', function(req,res,next){
    console.log("login!");

    res.render('login', { title: 'Express' })
});

/*
router.post('/login', function (req, res, next) {
    var
        user_email = req.body.username,
        password =   req.body.password;
    connection.query('select *from `t_user` where `email` = ?', user_email, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                res.json({success: false, msg: '해당 유저가 존재하지 않습니다.'})
            } else {
                if (!bcrypt.compareSync(password, result[0].password)) {
                    res.json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
                } else {
                    res.json({success: true})
                }
            }
        }
    });
});
*/
module.exports = router;