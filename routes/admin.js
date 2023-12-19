// Require
const router = express.Router();
import productController from "../controllers/productController.js";
import userController from "../controllers/userController.js";
import orderController from "../controllers/orderController.js";
import express from "express";
import multer from "multer";
import productQueries from "../queries/productQueries.js";
const storage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});
import itemsController from "../controllers/itemsController.js";

const upload = multer({ storage });



// router.use((req, res, next) => {
//   if (req.session.user !== undefined && req.session.user.user_isAdmin === 1) {
//     next();
//   } else {
//     res.render("404", {
//       user: req.session.user === undefined ? "" : req.session.user,
//     });
//   }
// });

router.get("/", async function (req, res, next) {
  
  try {
    let salesToday = await productQueries.salesTodayQuery();
    let salesThisMonth = await productQueries.salesThisMonthQuery() ?? 0;
    let allCustomers = await productQueries.allUsers() ?? 0;
    // Render the dashboard template and pass the data
    res.render("admin/dashboard.ejs", {
      user: req.session.user === undefined ? "" : req.session.user,
      salesToday: salesToday[0].totalSalesToday,
      salesThisMonth: salesThisMonth[0].totalSalesThisMonth,
      allCustomers,
      
    });
  } catch (error) {
    console.error(error.message);
    // Handle the error appropriately (e.g., render an error page)
  }
});

router.get("/login", async function (req, res, next) {

  {
    
    res.render("admin/login.ejs",{user: req.session.user===undefined?"":req.session.user});
  }
});
router.get("/dashboard", async function (req, res, next) {
  {
   
    let salesToday = await productQueries.salesTodayQuery();
    let salesThisMonth = await productQueries.salesThisMonthQuery();
    let allCustomers = await productQueries.allUsers();
    console.log(salesToday);
    console.log(salesThisMonth);
    console.log(allCustomers);
    res.render("admin/dashboard.ejs",{user: req.session.user===undefined?"":req.session.user, salesToday: salesToday[0].totalSalesToday, salesThisMonth: salesThisMonth[0].totalSalesThisMonth, allCustomers});
  }
});
router.get("/products", async function (req, res, next) {
  var products = await productController.searchItems({
    item_id: req.query.id,
    item_title: req.query.title,
    item_brand: req.query.brand,
    item_cat: req.query.category,
    item_price_min: req.query.price_min,
    item_price_max: req.query.price_max,
    item_qty_min: req.query.qty_min,
    item_qty_max: req.query.qty_max,
  });
  {
    res.render("admin/products.ejs", {
      user: req.session.user === undefined ? "" : req.session.user,
      products,
    });
  }
});
router.get("/orders", async function (req, res, next) {
  var orders = await orderController.getOrders()
  console.log(orders)
  {
    res.render("admin/orders.ejs", {
      user: req.session.user === undefined ? "" : req.session.user,
      orders,
    });
  }
});
router.get("/users", async function (req, res, next) {
  var users = await userController.getUsers();
  {
    res.render("admin/users.ejs", {
      user: req.session.user===undefined?"":req.session.user,
      users,
    });
  }
});
router.get("/users/toggle_admin/:id", async function (req, res, next) {
  await userController.toggleAdmin(req.params.id);
  res.redirect("/admin/users");
});
router.get("/users/delete/:id", async function (req, res, next) {
  await userController.deleteUser(req.params.id);
  res.redirect("/admin/users");
});
router.get("/orders", function (req, res, next) {
  {
    res.render("admin/orders.ejs",{user: req.session.user===undefined?"":req.session.user});
  }
});
router.get("/deleteProduct/:id",async function (req, res, next) {
  await itemsController.deleteProduct(req.params.id);
  res.redirect("/admin/products");
});
router.post("/getProductDetails", itemsController.getProductDetails);
router.post("/editUser", userController.editUser);
router.post("/createItem", upload.array("photo", 5), itemsController.createItem);
router.post("/upload", upload.single("file"), itemsController.uploadImage);
router.post('/delete', itemsController.deleteImage);
router.post("/getUserDetails", userController.getUserDetails);
router.post("/editItem", upload.array("photo", 5), itemsController.editItem);
//export default 

export default router;