// Require
const router = express.Router();

import express from "express";
import multer from "multer";
import fs from "fs";
const storage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});
import itemsController from "../controllers/itemsController.js";

const upload = multer({ storage });
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
router.post("/addItem", itemsController.createItem);
router.post("/upload", upload.single("file"), itemsController.uploadImage);
router.post('/delete', (req, res) => {
  const { filename } = req.body;

  // Define the path to the file
  const filePath = path.join('public/images', filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlink(filePath, (error) => {
      if (error) {
        console.log('Error deleting file:', error);
        res.status(500).send('Error deleting file');
      } else {
        console.log('File deleted successfully:', filename);
        res.status(200).send('File deleted successfully');
      }
    });
  } else {
    console.log('File not found:', filename);
    res.status(404).send('File not found');
  }
});

//export default 

export default router;