import express from "express";

// Create a new router instance
const router = express.Router();

import loginController from "../controllers/loginController.js";
import signupController from "../controllers/signupController.js";
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index',{user: req.session.user===undefined?"":req.session.user});
  });
  
/* GET Sign Up page. */
router.get('/signup', function(req, res, next) {
  const errors = {};
    res.render('signup',{user: req.session.user===undefined?"": req.session.user,errors: [], firstname: '', lastname: '', email: '', address: ''});
  });

router.get('/login', function(req, res, next) {
  const errors = '';
  res.render('login',{user:req.session.user===undefined?"":req.session.user,errors: [], email: ''});
});

router.post('/login', loginController.login);

router.post('/signup', signupController.signup);
router.post('/changeAccount', loginController.changeAccount);
router.use((req, res, next) => {

  if (req.session.user !== undefined) {
    
    next();

  } else {

    res.render('404');
  
  }
});

// Export the router
export default router;
