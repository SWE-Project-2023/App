import express from "express";
import productController from "../controllers/productController.js";
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    // Wait for the getCategories promise to resolve
    
    var products = await productController.searchItems({
      undefined
    });

    res.render('index', { user: req.session.user === undefined ? "" : req.session.user, products });
  } catch (error) {
    console.error(error.message);
    next(error); // Pass the error to the next middleware
  }
});

export default router;