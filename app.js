const port = 3010;
import express from "express";
import session from "express-session";
import mysql from "mysql2";
import execute from "./queries/productQueries.js";
import fs from "fs";
const sqlSettings = JSON.parse(fs.readFileSync("./sql.json"));
import userController from "./controllers/userController.js";
import https from "https";
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


if (port === 443) {
  const key = fs.readFileSync("/etc/letsencrypt/live/qanaa.tech/privkey.pem");
  const cert = fs.readFileSync("/etc/letsencrypt/live/qanaa.tech/fullchain.pem");
  const server = https.createServer({ key, cert }, app);
  server.listen(port, "0.0.0.0", () => {
    console.log('Running HTTPS Server on port ' + port);
  })
} else {
  app.listen(port, "127.0.0.1", () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
  });
}

const connection = mysql.createPool(sqlSettings);
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
const fetchCategoriesMiddleware = async (req, res, next) => {
  try {
    const categories = await execute.getCategories();
    res.locals.categories = categories; // Make categories available to templates
    next();
  } catch (error) {
    console.error(error.message);
    next(error); // Pass the error to the next middleware
  }
};
const fetchNotificationsMiddleware = async (req, res, next) => {
  try {
var notifications = [];
    if (req.session.user !== undefined) {
      notifications = await userController.getNotifications(req.session.user.user_id);
    }
    res.locals.notifications = notifications; // Make categories available to templates
    next();
  } catch (error) {
    console.error(error.message);
    next(error); // Pass the error to the next middleware
  }
};
const fetchLocationsMiddleware = async (req, res, next) => {
  try {
    const locations = await execute.getLocations();
    res.locals.locations = locations; // Make categories available to templates
    next();
  } catch (error) {
    console.error(error.message);
    next(error); // Pass the error to the next middleware
  }
};
app.use(fetchLocationsMiddleware);
app.use(fetchCategoriesMiddleware);
app.use(fetchNotificationsMiddleware);
// Import route handlers
import indexRouter from "./routes/index.js";
import productRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import checkoutRouter from "./routes/checkout.js";
import aboutRouter from "./routes/about.js";
import contactRouter from "./routes/contact.js";
import accountRouter from "./routes/account.js";

// Register route handlers
app.use("/", indexRouter);
app.use("/product", productRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/checkout", checkoutRouter);
app.use("/about", aboutRouter);
app.use("/contact", contactRouter);
app.use("/account", accountRouter);
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

// Middleware to fetch categories

// Admin pages


// Start the server


// Export the app
export default app;
