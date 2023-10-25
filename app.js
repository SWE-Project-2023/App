const express = require("express");
const app = express();
const mysql = require("mysql2");
const port = 3010; // Specify the port you want to use

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "qanaa",
  port: 3306,
});
connection.getConnection((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + connection);
});
// Serve static files (e.g., HTML, CSS, JavaScript) from a directory
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("Homepage.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/homepage", (req, res) => {
  res.render("homepage.ejs");
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

app.get("/productList", (req, res) => {
  res.render("productList.ejs", {
    category,
    products,
    totalPages: 1,
    currentPage: 1,
  });
});

 app.get('/signup', (req, res) => {
        res.render('signup.ejs');

        });

app.get('/itempage', (req, res) => {
          res.render('itempage.ejs');
    });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
