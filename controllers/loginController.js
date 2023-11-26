
const loginController = {}; 
import bcrypt from "bcryptjs";
import execute from "../queries/userQueries.js";
//function to connect to sql

loginController.login = async (req, res) => {
    console.log("Login request received");
    const { email, password } = req.body;

    // Perform data validation here
    if (!email || !password) {
        return res.status(400).send('All fields are required');
    }

    // Check if the email exists in the database
    const result = await execute.getUserByEmail(email);
    if (result.length === 0) {
        return res.status(400).send('Invalid email or password');
    }

    const user = result[0];
    const validPassword = await bcrypt.compare(password, user.user_password);

    if (!validPassword) {
        return res.status(400).send('Invalid email or password');
    }

	// Create a session
	req.session.user = user;
	res.redirect("/");
};


export default loginController;
