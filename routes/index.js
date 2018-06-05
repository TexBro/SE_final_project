var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var user_id= ''
    var grade = ''
    if(req.user){
        user_id =req.user.user_id;
        grade = req.user.grade;
        console.log(req.user.user_id);
    }
    res.render('index', { login_check:user_id , grade: grade});
});

module.exports = router;