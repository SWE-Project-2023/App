const signupController = {}; 
import bcrypt from "bcryptjs";
import execute from "../queries/userQueries.js";
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
  
	
	const hashedPassword = await bcrypt.hash(password, 10);
	await execute.createUser(firstname, lastname, email, hashedPassword, address), (err, results) => {
		if (err) {
		  console.error(err);
		}
		return res.redirect('/auth/login');
	  };
	
}

export default signupController;