// Import required modules
const express = require("express");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql2");
const port = 3010; // Specify the port you want to use

// Configure session middleware
// app.use(
//   session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
//   })
// );

const app = express();

app.use(
  session({
    secret: "hossisboo", // Replace with a secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.use(express.static("public", { maxAge: "7d" }));
// ... (the rest of your code)

app.listen(port, "127.0.0.1", () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});

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


// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));
app.get('/admin', (req, res) => res.redirect('/admin/dashboard'));
app.get('/admin/login', (req, res) => res.render('admin/login.ejs'));
app.get('/admin/dashboard', (req, res) => res.render('admin/dashboard.ejs'));
app.get('/admin/products', (req, res) => res.render('admin/products.ejs'));
app.get('/admin/users', (req, res) => res.render('admin/users.ejs'));
app.get('/admin/orders', (req, res) => res.render('admin/orders.ejs'));
// Import route handlers
const indexRouter = require("./routes/index.js");
const productRouter = require("./routes/products.js");
const authRouter = require("./routes/auth.js");

// Register route handlers
app.use("/", indexRouter);
app.use("/product", productRouter);
app.use("/auth", authRouter);

// Handle logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.use((req, res) => {
  res.status(404).render("404", {
    user: req.session.user === undefined ? "" : req.session.user,
  });
});


// Admin pages


// Start the server


// Export the app
module.exports = app;
