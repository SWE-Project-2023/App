import mysql from "mysql2/promise";
import fs from "fs";
const sqlSettings = JSON.parse(fs.readFileSync("./sql.json"));

const connection = mysql.createPool(sqlSettings);
const query = (sql, params) => connection.execute(sql, params);
const execute = {
  getOrders: async () => {
    try {
      let sql = "SELECT * FROM orders";
      const [orders] = await query(sql);
      let sql2 = "SELECT * FROM order_items";
      const [order_items] = await query(sql2);
      let sql3 = "SELECT * FROM item";
      const [items] = await query(sql3);
      orders.forEach((order) => {
        order.order_items = order_items.filter(
          (order_item) => order_item.order_id === order.order_id
        );
        order.order_items.forEach((order_item) => {
          order_item.item = items.find(
            (item) => item.item_id === order_item.item_id
          );
        });
      });
      return orders;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  changeStatus: async (id) => {
    try {
      const sql = 'UPDATE orders SET order_status = !order_status WHERE order_id = ?';
      const [result] = await query(sql, [id]);
      return result;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  deleteOrder: async (id) => {
    try {
      const sql = 'DELETE FROM orders WHERE order_id = ?';
      const [result] = await query(sql, [id]);
      return result;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};

export default execute;
