import express from "express";
const router = express.Router();

router.get('/', async function(req, res, next) {
  res.render('aboutUs',{user: req.session.user===undefined?"":req.session.user});
});
export default router;