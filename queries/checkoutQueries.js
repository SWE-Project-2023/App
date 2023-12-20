import mysql from "mysql2/promise";
import fs from "fs";
const sqlSettings = JSON.parse(fs.readFileSync("./sql.json"));
import orderQueries from "../queries/orderQueries.js";
const connection = mysql.createPool(sqlSettings);
const query = (sql, params) => connection.execute(sql, params);
const execute = {

    checkout: async (userId) => {
       try{
        const cartItemsSql = `
        SELECT
          cart.item_id,
          item.item_title,
          item.item_price,
            item.item_cat,
            item.item_quantity,
            item_brand
        FROM
          cart
        JOIN
          item ON cart.item_id = item.item_id
        WHERE
          cart.user_id = ?
      `;
        const [cartItems] = await query(cartItemsSql, [userId]);
  
        
       
        return cartItems;

       }catch(error){
        console.error(error.message);
      throw error;
       }

    },
    placeorder:async(itemid,userid,item_quantity)=>{
        try{
        const insertsql = 'INSERT INTO orders (user_id, order_date, order_status) VALUES (?, CURRENT_DATE, "pending")';
        const orderInsertResult = await query(insertsql, [userid]);
        const orderIdResult = await query('SELECT LAST_INSERT_ID() as order_id');
        console.log('Order ID Result:', orderIdResult);
        const orderId = orderIdResult[0][0].order_id;
        console.log(orderId)
        await query('INSERT INTO order_items (order_id, item_id, item_quantity) VALUES (?, ?, ?)', [orderId, itemid, item_quantity]);
        const deleteCartItemSql = 'DELETE FROM cart WHERE user_id = ? AND item_id = ?';
        await query(deleteCartItemSql, [userid, itemid]);
    
        // Decrement item quantity in the items table
        const decrementItemQuantitySql = 'UPDATE item SET item_quantity = item_quantity - 1 WHERE item_id = ?';
        await query(decrementItemQuantitySql, [ itemid]);
    
        try {
          await orderQueries.sendUserNotification(userid, `Your order #${orderId} has been placed successfully!`);
        } catch (error) {
          console.error('Error creating notification:', error);
        }
        console.log('Order placed successfully!');

        }catch(error){
            console.error('Error placing order:', error);
            throw error; // Propagate the error to the caller
        }
    }
};

export default execute;