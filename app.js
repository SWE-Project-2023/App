// Import required modules
const express = require('express');
const session = require('express-session');
const path = require('path');
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Update the path accordingly

// ... (the rest of your code)

app.listen(port, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));
// Import route handlers
const indexRouter = require('./routes/index.js');
const productRouter = require('./routes/products.js');
const authRouter = require('./routes/auth.js');

// Register route handlers
app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/auth', authRouter);

// Handle logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Export the app
module.exports = app;
