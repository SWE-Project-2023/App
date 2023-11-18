
const loginController = {}; 



import bcrypt from "bcryptjs";
import mysql from "mysql2";


loginController.login = async (req, res) => {
	console.log("Login request received");
	const { email, password } = req.body;
  
	// Perform data validation here
	if (!email || !password) {
	  return res.status(400).send('All fields are required');
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
	// Check if the email exists in the database
	const query = 'SELECT * FROM user WHERE email = ?';
	connection.query(query, [email], async (err, results) => {
	  if (err) {
		return res.status(500).send(err);
	  }
	  console.log("Result: " + results);
	  // Check if a user with the provided email was found
	  if (results.length === 0) {
		return res.render("login", { errors: "Invalid email or password", user: req.session.user === undefined ? "" : req.session.user });
	  }

	  

	  const isPasValid = await bcrypt.compare(password, results[0].user_password);
	  if (!isPasValid) {
		
		console.log("reeee: " + isPasValid + "Password: " + password + "Hashed Password: " + results[0].user_password);
		// Password does not match, display error message
		return res.render("login", { errors: "Invalid email or password", user: req.session.user === undefined ? "" : req.session.user });
	  }
	  console.log("weeeeee: " + isPasValid);
	  req.session.user = results[0];
  
	 // Password matches, render the account page with user data
	 return res.render('index',{user: req.session.user===undefined?"":req.session.user});
	});
  };

export default loginController;
