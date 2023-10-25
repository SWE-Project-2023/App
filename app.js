const express = require('express');
const app = express();
const port = 3010; // Specify the port you want to use

// Serve static files (e.g., HTML, CSS, JavaScript) from a directory
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render('Homepage.ejs');
  });

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/homepage', (req, res) => {
    res.render('homepage.ejs');
});

 app.get('/signup', (req, res) => {
        res.render('signup.ejs');

        });

app.get('/itempage', (req, res) => {
          res.render('itempage.ejs');
    });


// Admin pages
app.get('/admin', (req, res) => res.redirect('/admin/login'));
app.get('/admin/login', (req, res) => res.render('admin/login.ejs'));
app.get('/admin/dashboard', (req, res) => res.render('admin/dashboard.ejs'));
app.get('/admin/products', (req, res) => res.render('admin/products.ejs'));
app.get('/admin/users', (req, res) => res.render('admin/users.ejs'));
app.get('/admin/orders', (req, res) => res.render('admin/orders.ejs'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
