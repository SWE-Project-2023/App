const express = require('express');
const router = express.Router();

router.get('/itempage', function(req, res, next) {
  res.render('itempage');
});

/* GET client Product page. */
router.get('/productlist', function(req, res, next) {
  res.render('productlist');
});

router.get('/cart',function(req,res,next){
res.render('cart')
});

module.exports = router;
