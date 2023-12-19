import mysql from "mysql2/promise";
import fs from "fs";
const sqlSettings = JSON.parse(fs.readFileSync("./sql.json"));

const connection = mysql.createPool(sqlSettings);
const query = (sql, params) => connection.execute(sql, params);
const execute = {
  getOrders: async () => {
    let sql = "SELECT * FROM orders";
    try {
      const [rows] = await query(sql);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

};

export default execute;
