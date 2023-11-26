import express from "express";
import productController from "../controllers/productController.js";
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  var products = await productController.searchItems({
    undefined
  });

  res.render('index',{user: req.session.user===undefined?"":req.session.user,products});
});
export default router;