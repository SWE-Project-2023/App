// Require
import express from"express";
const router = express.Router();

router.get("/", function (req, res, next) {
  {
    res.render("admin/dashboard", {user: req.session.user===undefined?"":req.session.user});
  }
});
router.get("/login", function (req, res, next) {
  {
    res.render("admin/login.ejs",{user: req.session.user===undefined?"":req.session.user});
  }
});
router.get("/dashboard", function (req, res, next) {
  {
    res.render("admin/dashboard.ejs",{user: req.session.user===undefined?"":req.session.user});
  }
});
router.get("/products", function (req, res, next) {
  {
    res.render("admin/products.ejs",{user: req.session.user===undefined?"":req.session.user});
  }
});
router.get("/users", function (req, res, next) {
  {
    res.render("admin/users.ejs",{user: req.session.user===undefined?"":req.session.user});
  }
});
router.get("/orders", function (req, res, next) {
  {
    res.render("admin/orders.ejs",{user: req.session.user===undefined?"":req.session.user});
  }
});

export default router;