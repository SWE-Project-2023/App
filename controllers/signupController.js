
const signupController = {}; 
import bcrypt from "bcryptjs";
import mysql from "mysql2";

signupController.signup = async (req, res) => {
	console.log("Signup request received");
	const { firstname, lastname, email, password, confirmpassword } = req.body;

	// Perform data validation here
	if (!firstname || !lastname || !email || !password || !confirmpassword) {
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
	const query = 'INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
	connection.query(query, [firstname, lastname, email, hashedPassword], (err, results) => {
	  if (err) {
		console.error(err);
	  }
	  return res.redirect('/auth/login');
  	});
}

export default signupController;