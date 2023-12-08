import express from "express";
import itemsController from "../controllers/itemsController.js";
const router = express.Router();


router.get("/itempage", itemsController.displayitem);

router.get("/productlist", itemsController.getbyCategory);

router.get("/cart", function (req, res, next) {
  res.render("cart", {
    user: req.session.user === undefined ? "" : req.session.user,
  });
});
router.get("/wishlist", function (req, res, next) {
  res.render("wishlist", {
    user: req.session.user === undefined ? "" : req.session.user,
  });
});
router.post("/cart/add",itemsController.addtoCart);
router.post("/cart-add-bag",itemsController.additem);

export default router;
