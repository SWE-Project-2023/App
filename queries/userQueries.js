import mysql from "mysql2/promise";
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "qanaa",
    port: 3306,
  });
const query = (sql, params) => connection.execute(sql, params);
const execute = {
    getUserByEmail: async (email) => {
        const sql = 'SELECT * FROM user WHERE email = ?';
        const [result, fields] = await query(sql, [email]);
        return result;
    },
    getAllUsers: async () => {
        const sql = 'SELECT * FROM user';
        const [result, fields] = await query(sql);
        return result;
    },
    getUserById: async (id) => {
        const sql = 'SELECT * FROM user WHERE user_id = ?';
        const [result, fields] = await query(sql, [id]);
        return result;
    },
    deleteUser: async (id) => {
        const sql = 'DELETE FROM user WHERE user_id = ?';
        const [result, fields] = await query(sql, [id]);
        return result;
    },
    toggleAdmin: async (id) => {
        const sql = 'UPDATE user SET user_isAdmin = !user_isAdmin WHERE user_id = ?';
        const [result, fields] = await query(sql, [id]);
        return result;
    },
    createUser: async (firstname, lastname, email, password, address) => {
        const sql = 'INSERT INTO user (user_fname, user_Lname, email, user_password, user_address) VALUES (?, ?, ?, ?, ?)';
        const [result, fields] = await query(sql, [firstname, lastname, email, password, address]);
        return result;
    },
    

}

export default execute;