import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "qanaa",
  port: 3306,
});

const productController = {
  searchItems: async (options) => {
    let query = "SELECT * FROM item WHERE 1"; // 1 so we can use AND for the rest of the query

    if (options.item_id) {
      query += ` AND item_id = ${options.item_id}`;
    }

    if (options.item_title) {
      query += ` AND item_title LIKE '%${options.item_title}%'`;
    }

    if (options.item_brand) {
      query += ` AND item_brand = '${options.item_brand}'`;
    }

    if (options.item_cat) {
      query += ` AND item_cat = '${options.item_cat}'`;
    }

    if (options.item_price_min) {
      query += ` AND item_price >= ${options.item_price_min}`;
    }

    if (options.item_price_max) {
      query += ` AND item_price <= ${options.item_price_max}`;
    }

    if (options.item_qty_min) {
      query += ` AND item_qty >= ${options.item_qty_min}`;
    }

    if (options.item_qty_max) {
      query += ` AND item_qty <= ${options.item_qty_max}`;
    }
    try {
      const [rows, fields] = await connection.execute(query);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};

export default productController;
