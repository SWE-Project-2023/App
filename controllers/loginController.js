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

export default loginController;
