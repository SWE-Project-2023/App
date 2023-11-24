import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "qanaa",
  port: 3306,
});

const userController = {
  getUsers: async () => {
    let query = "SELECT * FROM user";
    try {
      const [rows, fields] = await connection.execute(query);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  deleteUser: async (id) => {
    let query = "DELETE FROM user WHERE user_id = ?";
    try {
      const [rows, fields] = await connection.execute(query, [id]);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  toggleAdmin: async (id) => {
    let query = "UPDATE user SET user_isAdmin = !user_isAdmin WHERE user_id = ?";
    try {
      const [rows, fields] = await connection.execute(query, [id]);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
};

export default userController;
