import mysql from "mysql2/promise";
import fs from "fs";
const sqlSettings = JSON.parse(fs.readFileSync("./sql.json"));
const connection = mysql.createPool(sqlSettings);
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
    getUserNotifications: async (id) => {
        const sql = 'SELECT * FROM notifications WHERE user_id = ?';
        const [result, fields] = await query(sql, [id]);
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
    getUserDetails: async (userId) => {
        const sql = `
          SELECT
            u.user_id,
            u.user_fname,
            u.user_Lname,
            u.email,
            u.user_address,
            u.user_isAdmin
            -- Add more columns as needed
          FROM
            user u
          WHERE
            u.user_id = ?
        `;
        const params = [userId];
        try {
          const [rows] = await query(sql, params);
          return rows;
        } catch (error) {
          console.error(error.message);
          throw error;
        }
      },
      updateUser: async (
        user_id,
        user_fname,
        user_lname,
        email,
        user_address,
      ) => {
        const sql = `UPDATE user SET user_fname = ?, user_Lname = ?, email = ?, user_address = ? WHERE user_id = ?`;
        const params = [
          user_fname,
          user_lname,
          email,
          user_address,
          user_id,
        ];
      
        try {
          const [rows] = await query(sql, params);
          return rows;
        } catch (error) {
          console.error(error.message);
          throw error;
        }
      },
      updateUserDetails: async (
        user_id,
        user_fname,
        user_Lname,
        user_address
    ) => {
      console.log("Update user details request received");
        const sql = `
            UPDATE user
            SET
                user_fname = ?,
                user_Lname = ?,
                user_address = ?
            WHERE
                user_id = ?
        `;
        const params = [user_fname, user_Lname, user_address, user_id];

        try {
            // Execute the query
            const [rows] = await query(sql, params);

            // Return the result
            return rows;
        } catch (error) {
            // Handle errors
            console.error(error.message);
            throw error;
        }
    },
    
}

export default execute;