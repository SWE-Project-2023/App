import express from "express";
import execute from "../queries/userQueries.js";
const router = express.Router();

router.use((req, res, next) => {

  if (req.session.user !== undefined || req.session.user!=="") {
    
    next();

  } else {

    res.render('404');
  
  }
});
router.get('/', async function(req, res, next) {
  try {
    const userId = req.session.user.user_id;
    console.log("User ID:", userId);
    const user = await execute.getUserById(userId);
    console.log("User Data:", user);
    res.render('account', { user: req.session.user===undefined?"":req.session.user, myUser: user[0]});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;