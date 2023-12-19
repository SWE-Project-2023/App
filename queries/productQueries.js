import mysql from "mysql2/promise";
import sqlSettings from "./../sql.json" assert { type: "json" };
const connection = mysql.createPool(sqlSettings);
const query = (sql, params) => connection.execute(sql, params);
const execute = {
  searchItems: async (options) => {
    let sql = "SELECT * FROM item WHERE 1"; // 1 so we can use AND for the rest of the sql

    if (options?.item_id) {
      sql += ` AND item_id = ${options?.item_id}`;
    }

    if (options?.item_title) {
      sql += ` AND item_title LIKE '%${options?.item_title}%'`;
    }

    if (options?.item_brand) {
      sql += ` AND item_brand = '${options?.item_brand}'`;
    }

    if (options?.item_cat) {
      sql += ` AND item_cat = '${options?.item_cat}'`;
    }

    if (options?.item_price_min) {
      sql += ` AND item_price >= ${options?.item_price_min}`;
    }

    if (options?.item_price_max) {
      sql += ` AND item_price <= ${options?.item_price_max}`;
    }

    if (options?.item_qty_min) {
      sql += ` AND item_qty >= ${options?.item_qty_min}`;
    }

    if (options?.item_qty_max) {
      sql += ` AND item_qty <= ${options?.item_qty_max}`;
    }
    try {
      const [rows] = await query(sql);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  insertItem: async (
    item_title,
    item_cat,
    item_brand,
    item_details,
    item_quantity,
    item_price,
    item_offers
  ) => {
    const sql = `INSERT INTO item (item_title, item_cat,item_brand, item_details, item_quantity, item_price,item_offers) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      item_title,
      item_cat,
      item_brand,
      item_details,
      item_quantity,
      item_price,
      item_offers,
    ];
    try {
      const [rows] = await query(sql, params);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  insertImage: async (itemId, imagePath) => {
    const sql = `INSERT INTO item_images (item_id, image_path) VALUES (?, ?)`;
    const params = [itemId, imagePath];
    try {
      const [rows] = await query(sql, params);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  findProduct: async (title) => {
    const sql = `SELECT * FROM item WHERE item_title = ?`;
    const params = [title];
    try {
      const [rows] = await query(sql, params);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  getProductDetails: async (id) => {
    const sql = `
    SELECT
      i.item_id,
      i.item_title,
      i.item_brand,
      i.item_cat,
      i.item_details,
      i.item_quantity,
      i.item_price,
      i.item_offers,
      im.image_path
    FROM
      item i
    LEFT JOIN
      item_images im ON i.item_id = im.item_id
    WHERE
      i.item_id = ?
    `;
    const params = [id];
    try {
      const [rows] = await query(sql, params);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  deleteImage: async (imageId) => {
    const sql = `DELETE FROM item_images WHERE image_path = ?`;
    const params = [imageId];
    try {
      const [rows] = await query(sql, params);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  updateItem: async (
    item_id,
    item_title,
    item_cat,
    item_brand,
    item_details,
    item_quantity,
    item_price,
    item_offers
  ) => {
    console.log(item_title, item_cat, item_brand, item_details, item_quantity, item_price, item_offers, item_id);
    const sql = `UPDATE item SET item_title = ?, item_cat = ?, item_brand = ?, item_details = ?, item_quantity = ?, item_price = ?, item_offers = ? WHERE item_id = ?`;
    const params = [
      item_title,
      item_cat,
      item_brand,
      item_details,
      item_quantity,
      item_price,
      item_offers,
      item_id,
    ];
    try {
      const [rows] = await query(sql, params);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  deleteImages: async (itemId) => {
    const sql = `DELETE FROM item_images WHERE item_id = ?`;
    const params = [itemId];
    try {
      const [rows] = await query(sql, params);
      return rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  displayitem : async (productId) => {
      // SQL query to fetch the product details from the database based on the product ID
    const sql = "SELECT * FROM item WHERE item_id = ?";
    try {
      const [result] = await query(sql, [productId]);
      return result;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
    
  },
  getbyCategory :async (category) =>{
    // SQL query to fetch items by category
    const sql = `SELECT * FROM item WHERE item_cat = ?`;
      
    try {
      const [results] = await query(sql, [category]);
      return results;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
 addtoCart: async (itemId, userId) => {
  // Check if the item already exists in the user's cart
  const checkIfExistsQuery = 'SELECT * FROM cart WHERE user_id = ? AND item_id = ?';
  const sql = `
  SELECT c.user_id, c.item_id, i.item_title,
  i.item_brand, i.item_cat, i.item_details,
   c.quantity, i.item_price, i.item_offers
  FROM cart c
  JOIN item i ON c.item_id = i.item_id
  WHERE c.user_id = ? AND c.item_id = ?;
`;
  try {
    const [existingCartItem] = await query(checkIfExistsQuery, [userId, itemId]);

    if (existingCartItem.length>0) {


      // If the item already exists, update the quantity
      const updateQuantityQuery = 'UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND item_id = ?';
      await query(updateQuantityQuery, [userId, itemId]);
      
      // Return information about the updated item
      const [updatedItem] = await query(sql,[userId,itemId]);
      return updatedItem;
    } else {
  

      // If the item doesn't exist, insert a new row
      const insertQuery = 'INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, 1)';
      await query(insertQuery, [userId, itemId]);

      // Return information about the inserted item
      const [insertedItem] = await query(sql, [userId,itemId]);
      return insertedItem;
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
},

  additem: async (productIds) =>{
    const sql = `
    SELECT c.user_id, c.item_id,c.quantity, i.item_title,
    i.item_brand,
    i.item_cat,
    i.item_details,
    i.item_quantity,
    i.item_price,
    i.item_offers
    FROM cart c
    JOIN item i ON c.item_id = i.item_id
    WHERE c.user_id = ?;
  `;
    try {
      const [results]= await query(sql, [productIds]);
    return results;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
},
getCart:async(userId)=>{
  const sql = `
  SELECT c.user_id, c.item_id,c.quantity, i.item_title,
  i.item_brand,
  i.item_cat,
  i.item_details,
  i.item_quantity,
  i.item_price,
  i.item_offers
  FROM cart c
  JOIN item i ON c.item_id = i.item_id
  WHERE c.user_id = ?;
`;
try {
  const [results]= await query(sql, [userId]);
return results;
} catch (error) {
console.error(error.message);
throw error;
}
},
deleteitem:async(userId,productId)=>{
  const sql = `DELETE FROM cart WHERE user_id = ? AND item_id = ?`;
  try {
    const [results]= await query(sql, [userId,productId]);
    console.log("deleteeed")
  return results;
  } catch (error) {
  console.error(error.message);
  throw error;
  }
},
 getImagesByProductId: async (productId) => {
  const sql = `SELECT image_path FROM item_images WHERE item_id = ?`;
  try {
    const [rows] = await query(sql, [productId]);
    return rows;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
},
deleteImageByPath: async (imagePath) => {
  const sql = `DELETE FROM item_images WHERE image_path = ?`;
  try {
    const [rows] = await query(sql, [imagePath]);
    return rows;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
},
deleteProduct: async (productId) => {
  const sql = `DELETE FROM item WHERE item_id = ?`;
  try {
    const [rows] = await query(sql, [productId]);
    return rows;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
},
salesTodayQuery: async () => {
  const sql = `
    SELECT COALESCE(SUM(item_price * order_quantity), 0) AS totalSalesToday
    FROM orders
    WHERE DATE(order_date) = CURDATE();
  `;
  try {
    const [rows] = await query(sql);
    return rows;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
},

salesThisMonthQuery: async () => {
  const sql = `
    SELECT COALESCE(SUM(item_price * order_quantity), 0) AS totalSalesThisMonth
    FROM orders
    WHERE MONTH(order_date) = MONTH(CURDATE()) AND YEAR(order_date) = YEAR(CURDATE());
  `;
  try {
    const [rows] = await query(sql);
    return rows;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
},

allUsers: async () => {
  const sql = `
    SELECT COALESCE(COUNT(DISTINCT user_id), 0) AS totalUsers
    FROM orders;
  `;
  try {
    const [rows] = await query(sql);
    return rows[0].totalUsers;  // Extract the value from the result
  } catch (error) {
    console.error(error.message);
    throw error;
  }
},
updateCartItemQuantity: async (userId, itemId, newQuantity) => {
  try {
    // Corrected SQL update query
    const updateQuery = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND item_id = ?';

    // Execute the query
    const updateResult = await query(updateQuery, [newQuantity, userId, itemId]);

    return updateResult;
  } catch (error) {
    throw error;
  }
},



};

export default execute;
