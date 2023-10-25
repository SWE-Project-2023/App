const express = require('express');

// Create a new router instance
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
  });
  
/* GET Sign Up page. */
router.get('/signup', function(req, res, next) {
  const errors = {};
    res.render('signup');
  });


router.get('/login', function(req, res, next) {
  const errors = '';
  res.render('login');
});

router.use((req, res, next) => {

  if (req.session.user !== undefined) {
    
    next();

  } else {

    res.render('404');
  
  }
});

// Export the router
module.exports = router;
