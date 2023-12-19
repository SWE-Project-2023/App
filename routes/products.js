import express from "express";
import itemsController from "../controllers/itemsController.js";
const router = express.Router();


router.get("/itempage", itemsController.displayitem);

router.get("/list", itemsController.viewProducts);

router.get("/cart", itemsController.getCart);
router.get("/wishlist", itemsController.getwishlist);
router.post("/cart/updateQuantity", itemsController.updateCartItemQuantity);
router.post("/cart/add",itemsController.addtoCart);
router.post("/cart-add-bag",itemsController.additem);
router.post("/cart/delete",itemsController.deleteitem);
router.post("/wishlist/add",itemsController.addtoWishlist);
router.post("/wishlist/delete",itemsController.deleteWishlistItem)


export default router;
