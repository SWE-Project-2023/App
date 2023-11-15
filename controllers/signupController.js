const bcrypt = require("bcryptjs");
const signupController = {}; 
const mysql = require("mysql2");


signupController.signup = async (req, res) => {
	console.log("Signup request received");
	const { firstname, lastname, email, password, confirmpassword, address } = req.body;

	// Perform data validation here
	if (!firstname || !lastname || !email || !password || !confirmpassword || !address) {
	  return res.status(400).send('All fields are required');
	}

	if (password.length < 8) {
		return res.status(400).send('Password must be at least 8 characters long');
	}

	if (password !== confirmpassword) {
		return res.status(400).send('Passwords do not match');
	}

	if (!email.includes('@') || !email.includes('.')) {
		return res.status(400).send('Invalid email');
	}
  
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

	const hashedPassword = await bcrypt.hash(password, 10);
	const query = 'INSERT INTO user (user_fname, user_Lname, email, user_password, user_address) VALUES (?, ?, ?, ?, ?)';
	connection.query(query, [firstname, lastname, email, hashedPassword, address], (err, results) => {
	  if (err) {
		console.error(err);
	  }
	  return res.redirect('/auth/login');
  	});
}

module.exports = signupController;