const express = require('express');
const app = express();
const port = 3010; // Specify the port you want to use

// Serve static files (e.g., HTML, CSS, JavaScript) from a directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.get('/homepage', (req, res) => {
    res.render('homepage.ejs');
});

 app.get('/signup', (req, res) => {
        res.render('signup.ejs');
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
