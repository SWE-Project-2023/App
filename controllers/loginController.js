const loginController = {}; 

import bcrypt from "bcryptjs";
import mysql from "mysql2/promise"; 
//function to connect to sql


const connection = await mysql.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "qanaa",
	port: 3306,
  });
const sqlquery = (sql, params) => connection.execute(sql, params);
loginController.login = async (req, res) => {
    console.log("Login request received");
    const { email, password } = req.body;

    // Perform data validation here
    if (!email || !password) {
        return res.status(400).send('All fields are required');
    }

    // Check if the email exists in the database
    const query = 'SELECT * FROM user WHERE email = ?';
    const [result, fields] = await sqlquery(query, [email]);

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
