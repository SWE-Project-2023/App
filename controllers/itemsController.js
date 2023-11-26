const itemsController = {};
import mysql from "mysql2/promise"; // Import mysql2 promise-based library
import fs from "fs";
import path from "path";
const connection = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "qanaa",
  port: 3306,
});
// Function to query the database
const query = (sql, params) => connection.execute(sql, params);
itemsController.createItem = async (req, res) => {
  // Extract data from the request body
  console.log( "req.body",req.body);
  const {
    productName,
    category,
    brand,
    price,
    description,
    quantity,
    offers,
  } = req.body;

  const uploadedImagePaths = JSON.parse(req.body.uploadedImagePaths);

  // Backend validation
  let errors = {};

  if (!productName || productName.trim() === "") {
    errors.productName = "Please enter the product name";
  }

  if (!price) {
    errors.price = "Please enter the price";
  } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
    errors.price = "Price must be a number with a maximum of two decimal places";
  }

  if (!brand) {
    errors.brand = "Please enter the brand";
  }

  if (!quantity || !/^\d+$/.test(quantity)) {
    errors.quantity = "Quantity must be a positive whole number";
  }

  if (!description) {
    errors.description = "Please enter the description";
  }

  if(!offers){
    errors.offers = "Please enter the offers";
  }
  if (Object.keys(errors).length > 0) {
    // Return validation errors to the client
    console.log("Validation errors:", errors);
    return res.render("addeditproduct", { errors, product: "add" });
  }

  // Create a MySQL connection pool
  

  try {
    // Check if the product already exists
    const existingProductQuery = 'SELECT * FROM item WHERE item_title = ?';
    console.log("Executing query:", existingProductQuery);
    console.log("Query parameters:", [productName]);

    const [rows, fields] = await query(existingProductQuery, [productName]);

  if (!rows) {
    console.error("Error executing query:", existingProductQuery);
    console.error("Error details:", fields);
    throw new Error("Error executing query");
  }

  else if (rows.length > 0) {
    // Product with the same title already exists
    errors.productName = "Product with this title already exists";
    console.log("Product with the same title already exists");
    return res.render("/admin/products", { errors, product: "add" });
  }
    // Insert into the 'item' table
    const insertItemQuery = `
      INSERT INTO item (item_title, item_cat,item_brand, item_details, item_quantity, item_price,item_offers)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    console.log("Executing query:", insertItemQuery);
    console.log("Query parameters:", [
      productName,
      category,
      description,
      quantity,
      price,
      brand,
      offers,
    ]);

    const [insertItemResult] = await query(insertItemQuery, [
      productName,
      category,
      brand,
      description,
      quantity,
      price,
      offers,
    ]);

    const itemId = insertItemResult.insertId;
    console.log("Item inserted with ID:", itemId);

    // Insert into the 'item_images' table
    const insertImageQuery = `
      INSERT INTO item_images (item_id, image_path)
      VALUES (?, ?)
    `;
    console.log("Executing query for image insertion:", insertImageQuery);
    
    for (const imagePath of uploadedImagePaths) {
      console.log("Query parameters:", [itemId, imagePath]);
      
      await query(insertImageQuery, [itemId, imagePath]);
    }

    console.log("Images inserted successfully");

    return res.redirect("/admin/products");
  } catch (error) {
    console.error("Error saving item:", error);
    errors.general = "Failed to add item";
    res.render("/admin/products", { errors, product: "add" });
  } 
};

itemsController.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file received" });
  }

  // File was successfully uploaded
  return res.status(200).json({ message: "File uploaded successfully" });
};

itemsController.getProductDetails = async (req, res) => {
  const productId = parseInt(req.body.productId);

  // Query to get product details along with associated images
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

  try {
    // Execute the query
    const [results] = await query(sql, [productId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Format the data and send it as JSON
    const productDetails = {
      productId: results[0].item_id,
      productName: results[0].item_title,
      brand: results[0].item_brand,
      category: results[0].item_cat,
      description: results[0].item_details,
      quantity: results[0].item_quantity,
      price: results[0].item_price,
      offers: results[0].item_offers,
      images: results.map(result => result.image_path).filter(image => image !== null)
    };

    res.json(productDetails);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
itemsController.deleteImage = async (req, res) => {
  try {
    const { filename } = req.body;
    console.log("filename", filename);

    // Step 1: Define the path to the file
    // Step 2: Check if the file exists
    if (fs.existsSync(filename)) {
      // Step 3: Delete the file
      fs.unlink(filename, (error) => {
        if (error) {
          console.log('Error deleting file:', error);
          return res.status(500).send('Error deleting file');
        }

        console.log('File deleted successfully:', filename);
      });
    } else {
      console.log('File not found:', filename);
      // You can still proceed to delete from the database even if the file is not found
    }

    try {
      // Step 4: Remove the entry from the item_images table
      const deleteImageQuery = 'DELETE FROM item_images WHERE image_path = ?';
  
      
      const [result] = await query(deleteImageQuery, [filename]);

      console.log('Database entry deleted successfully:', result);

      // Step 5: Send the response after attempting to delete from the database
      res.status(200).send('File and database entry deletion attempted successfully');
    } catch (dbError) {
      console.log('Error deleting database entry:', dbError);
      res.status(500).send('Error deleting database entry');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
itemsController.editItem = async (req, res) => {
  // Extract data from the request body
  const {
    productId,
    productName,
    category,
    brand,
    price,
    description,
    quantity,
    offers,
  } = req.body;

  const uploadedImagePaths = JSON.parse(req.body.uploadedImagePaths);

  // Backend validation
  let errors = {};

  if (!productId || isNaN(productId)) {
    errors.general = "Invalid product ID";
    return res.render("addeditproduct", { errors, product: "edit" });
  }

  if (!productName || productName.trim() === "") {
    errors.productName = "Please enter the product name";
  }

  if (!price) {
    errors.price = "Please enter the price";
  } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
    errors.price = "Price must be a number with a maximum of two decimal places";
  }

  if (!brand) {
    errors.brand = "Please enter the brand";
  }

  if (!quantity || !/^\d+$/.test(quantity)) {
    errors.quantity = "Quantity must be a positive whole number";
  }

  if (!description) {
    errors.description = "Please enter the description";
  }

  if(!offers){
    errors.offers = "Please enter the offers";
  }
  if (Object.keys(errors).length > 0) {
    // Return validation errors to the client
    console.log("Validation errors:", errors);
    return res.render("addeditproduct", { errors, product: "edit" });
  }

  try {
    // Update the 'item' table
    const updateItemQuery = `
      UPDATE item
      SET item_title=?, item_cat=?, item_brand=?, item_details=?, item_quantity=?, item_price=?, item_offers=?
      WHERE item_id=?
    `;
    console.log("Executing query:", updateItemQuery);
    console.log("Query parameters:", [
      productName,
      category,
      brand,
      description,
      quantity,
      price,
      productId,
      offers,
    ]);

    await query(updateItemQuery, [
      productName,
      category,
      brand,
      description,
      quantity,
      price,
      productId,
      offers,
    ]);

    console.log("Item updated successfully");

    // Delete existing images for the item
    const deleteImagesQuery = `
      DELETE FROM item_images
      WHERE item_id=?
    `;
    console.log("Executing query for deleting existing images:", deleteImagesQuery);
    console.log("Query parameters:", [productId]);

    await query(deleteImagesQuery, [productId]);

    // Insert new images into the 'item_images' table
    const insertImageQuery = `
      INSERT INTO item_images (item_id, image_path)
      VALUES (?, ?)
    `;
    console.log("Executing query for image insertion:", insertImageQuery);
    
    for (const imagePath of uploadedImagePaths) {
      console.log("Query parameters:", [productId, imagePath]);
      
      await query(insertImageQuery, [productId, imagePath]);
    }

    console.log("Images inserted successfully");

    return res.redirect("/admin/products");
  } catch (error) {
    console.error("Error updating item:", error);
    errors.general = "Failed to update item";
    res.render("/admin/products", { errors, product: "edit" });
  }
};

itemsController.displayitem = async (req, res) => {
  try {
    
    const productId = req.query.id;
    console.log(productId);

    // SQL query to fetch the product details from the database based on the product ID
    const sql = "SELECT * FROM item WHERE item_id = ?";
   
    const [results] = await query(sql, [productId]);

    // Check if a product was found
    if (results.length > 0) {
      const product = results[0];
     
      res.render("itempage.ejs", {user: req.session.user===undefined?"":req.session.user, product });
    } else {
      // If no product is found, you might want to handle this case (e.g., show an error page)
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.error(error.message);
    // Handle any errors that occurred during the database query
    res.status(500).send("Internal Server Error");
  }


};

export default itemsController;
