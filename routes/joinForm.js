var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('joinForm',{title:'Join Form!'});
    console.log("hello world! \n");
});

router.post('/',function(req,res,next){
    console.log(req.body);
    res.json(req.body);
});


module.exports = router;