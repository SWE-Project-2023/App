import mysql from "mysql2/promise";
import fs from "fs";
const sqlSettings = JSON.parse(fs.readFileSync("./sql.json"));

const connection = mysql.createPool(sqlSettings);
const query = (sql, params) => connection.execute(sql, params);
const execute = {
  searchItems: async (options) => {
    let sql = `
      SELECT item.*, GROUP_CONCAT(item_images.image_path) AS image_paths
      FROM item
      LEFT JOIN item_images ON item.item_id = item_images.item_id
      WHERE 1
    `;

    if (options?.item_id) {
      sql += ` AND item.item_id = ${options?.item_id}`;
    }

    if (options?.item_title) {
      sql += ` AND item.item_title LIKE '%${options?.item_title}%'`;
    }

    if (options?.item_brand) {
      sql += ` AND item.item_brand = '${options?.item_brand}'`;
    }

    if (options?.item_cat) {
      sql += ` AND item.item_cat = '${options?.item_cat}'`;
    }

    if (options?.item_price_min) {
      sql += ` AND item.item_price >= ${options?.item_price_min}`;
    }

    if (options?.item_price_max) {
      sql += ` AND item.item_price <= ${options?.item_price_max}`;
    }

    if (options?.item_qty_min) {
      sql += ` AND item.item_qty >= ${options?.item_qty_min}`;
    }

    if (options?.item_qty_max) {
      sql += ` AND item.item_qty <= ${options?.item_qty_max}`;
    }
    sql += ` GROUP BY item.item_id`;
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
    return [
      {
        totalSalesToday: 0
      }
    ]
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
      return [
        {
        totalSalesThisMonth: 0
      }
    ]
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
    console.error(error.message)
    return [
        {
        totalUsers: 0
      }
    ]
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

getCategories: async () => {
  const sql = 'SELECT * FROM categories';
  try {
    const [rows] = await query(sql);
    return rows;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
},

addtoWishlist:async(userId,productId)=>{
    
  try {
    // Check if the item is already in the wishlist for the user
    const checkDuplicateSql = 'SELECT * FROM wishlist WHERE item_id = ?';
    const [duplicateCheckResult] = await query(checkDuplicateSql, [ productId]);

    if (duplicateCheckResult.length > 0) {
      // Item already exists in the wishlist for the user, you can handle this as needed
      console.log('Item already in wishlist for the user');
      return duplicateCheckResult; // You can return the existing entry or handle it as needed
    }else{

    // Item is not in the wishlist, proceed with the insertion
    const insertSql = 'INSERT INTO wishlist (user_id, item_id) VALUES (?, ?)';
    console.log('Item  in wishlist for the user');
    const insertResult = await query(insertSql, [userId, productId]);

    return insertResult;}
} catch (error) {
  throw error;
}
},
getwishlist:async(userId)=>{
const sql = `
SELECT w.user_id, w.item_id, i.item_title,
i.item_brand,
i.item_cat,
i.item_details,
i.item_quantity,
i.item_price,
i.item_offers
FROM wishlist w
JOIN item i ON w.item_id = i.item_id
WHERE w.user_id = ?;
`;
try {
const [results]= await query(sql, [userId]);
return results;
} catch (error) {
console.error(error.message);
throw error;
}},
deleteWishlistItem:async(userId,productId)=>{
const sql = `DELETE FROM wishlist WHERE user_id =? AND item_id = ?`;
try {
  const [results]= await query(sql, [userId,productId]);
  console.log("deleteeed");
return results;
} catch (error) {
console.error(error.message);
throw error;
}
}

};

export default execute;
