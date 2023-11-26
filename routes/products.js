import express from "express";
const router = express.Router();

router.get("/itempage", function (req, res, next) {
  res.render("itempage");
});

const category = "Sample Category";
const products = [
  {
    name: "Sample Product 1",
    price: 10.0,
    description: "This is a sample product.",
    image: "/images/banner1.png",
  },
  {
    name: "Sample Product 2",
    price: 20.0,
    description:
      "Another sample product description sadsa das dasd asd asd sad sa das sda.",
    image: "/images/featured2.png",
  },
  // Add more sample products here
];

router.get("/productlist", (req, res) => {
  res.render(
    "productList.ejs",
    {
      category,
      products,
      totalPages: 1,
      currentPage: 1,
    },
    { user: req.session.user === undefined ? "" : req.session.user }
  );
});
router.get("/cart", function (req, res, next) {
  res.render("cart", {
    user: req.session.user === undefined ? "" : req.session.user,
  });
});

export default router;
