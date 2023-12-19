const loginController = {};
import bcrypt from "bcryptjs";
import execute from "../queries/userQueries.js";

loginController.login = async (req, res) => {
    console.log("Login request received");
    const { email, password } = req.body;

    // Create an array to store error messages with field names
    const errors = [];

    // Perform data validation here
    if (!email || !password) {
        errors.push({ field: 'email', message: 'Email and password are required' });
    }

    // If there are errors, render the login form with the errors
    if (errors.length > 0) {
        return res.render('login', { user: req.session.user === undefined ? "" : req.session.user, errors, email });
    }

    // Check if the email exists in the database
    const result = await execute.getUserByEmail(email);
    if (result.length === 0) {
        errors.push({ field: 'email', message: 'Invalid email or password' });
        return res.render('login', { user: req.session.user === undefined ? "" : req.session.user, errors, email });
    }

    const user = result[0];
    const validPassword = await bcrypt.compare(password, user.user_password);

    if (!validPassword) {
        errors.push({ field: 'password', message: 'Invalid email or password' });
        return res.render('login', { user: req.session.user === undefined ? "" : req.session.user, errors, email });
    }

    // Create a session
    req.session.user = user;
    res.redirect("/");
};
loginController.changeAccount = async (req, res) => {
    console.log("Change Account request received");
    console.log(req.body);
    const { id, user_fname, user_Lname, user_address } = req.body;

    // Create an array to store error messages with field names
    const errors = [];

    // Perform data validation here
    if (!id || !user_fname || !user_Lname || !user_address) {
        errors.push({ field: 'all', message: 'All fields are required' });
    }

    // If there are errors, handle them accordingly
    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    // Update the user details in the database
    try {
        const result = await execute.updateUserDetails(id, user_fname, user_Lname, user_address);
        
        // Check if the update was successful
        if (result.affectedRows > 0) {
            return res.status(200).json({ success: true, message: 'User details updated successfully' });
        } else {
            return res.status(500).json({ success: false, message: 'Error updating user details' });
        }
    } catch (error) {
        console.error('Error updating user details:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export default loginController;
