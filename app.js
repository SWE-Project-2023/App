const express = require("express");
const app = express();
const mysql = require("mysql2");
const port = 3010; // Specify the port you want to use

app.use(express.urlencoded({ extended: true }));

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
  res.render("homepage.ejs");
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

app.get('/checkout', (req, res) => {
    res.render('checkout.ejs');
});

app.get('/itempage', (req, res) => {
    res.render('itempage.ejs');
});

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

app.post('/signup', (req, res) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;

  // Perform data validation here
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long');
  }

  if (!isValidEmail(email)) {
    return res.status(400).send('Please enter a valid email address');
  }

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  // Insert data into the database
  const query = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
  connection.query(query, [firstname, lastname, email, password], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).send('Signup successful');
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Perform data validation here
  if (!email || !password) {
    return res.status(400).send('All fields are required');
  }

  // Check if the email exists in the database
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Check if a user with the provided email was found
    if (results.length === 0) {
      return res.status(401).send('Email not found');
    }

    const storedPassword = results.password;
    if (password !== storedPassword) {
      return res.status(401).send('Incorrect password');
    }

    // If the email and password match, you can respond with a successful login message
    return res.status(200).send('Login successful');
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});