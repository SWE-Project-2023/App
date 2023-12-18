const signupController = {};
import bcrypt from "bcryptjs";
import execute from "../queries/userQueries.js";

signupController.signup = async (req, res) => {
  console.log("Signup request received");
  const { firstname, lastname, email, password, confirmpassword, address } = req.body;

  // Create an array to store error messages with field names
  const errors = [];

  // Perform data validation here
  if (!firstname) {
    errors.push({ field: 'firstname', message: 'First name is required' });
  }

  if (!lastname) {
    errors.push({ field: 'lastname', message: 'Last name is required' });
  }

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!email.includes('@') || !email.includes('.')) {
    errors.push({ field: 'email', message: 'Invalid email' });
  }

  if (!password || password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
  }

  if (password !== confirmpassword) {
    errors.push({ field: 'confirmpassword', message: 'Passwords do not match' });
  }

  if (!address) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  // If there are errors, render the signup form with the errors
  if (errors.length > 0) {
    return res.render('signup', { user: req.session.user===undefined?"": req.session.user, errors, firstname, lastname, email, address });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await execute.createUser(firstname, lastname, email, hashedPassword, address);
    return res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    // Handle database error
    return res.status(500).render('error', { message: 'Internal Server Error' });
  }
};

export default signupController;
