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

// Import route handlers
const indexRouter = require("./routes/index.js");
const productRouter = require("./routes/products.js");
const authRouter = require("./routes/auth.js");
const adminRouter = require("./routes/admin.js");
// Register route handlers
app.use("/", indexRouter);
app.use("/product", productRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
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
