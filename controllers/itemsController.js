const itemsController = {};
import mysql from "mysql2/promise"; // Import mysql2 promise-based library

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

  if (Object.keys(errors).length > 0) {
    // Return validation errors to the client
    console.log("Validation errors:", errors);
    return res.render("addeditproduct", { errors, product: "add" });
  }

  // Create a MySQL connection pool
  const connection = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "qanaa",
    port: 3306,
  });

  try {
    // Check if the product already exists
    const existingProductQuery = 'SELECT * FROM item WHERE item_title = ?';
    console.log("Executing query:", existingProductQuery);
    console.log("Query parameters:", [productName]);

    const [rows, fields] = await connection.execute(existingProductQuery, [productName]);

  if (!rows) {
    console.error("Error executing query:", existingProductQuery);
    console.error("Error details:", fields);
    throw new Error("Error executing query");
  }

  else if (rows.length > 0) {
    // Product with the same title already exists
    errors.productName = "Product with this title already exists";
    console.log("Product with the same title already exists");
    return res.render("addeditproduct", { errors, product: "add" });
  }
    // Insert into the 'item' table
    const insertItemQuery = `
      INSERT INTO item (item_title, item_cat,item_brand, item_details, item_quantity, item_price)
      VALUES (?,?, ?, ?, ?, ?)
    `;
    console.log("Executing query:", insertItemQuery);
    console.log("Query parameters:", [
      productName,
      category,
      description,
      quantity,
      price,
      brand,
    ]);

    const [insertItemResult] = await connection.execute(insertItemQuery, [
      productName,
      category,
      description,
      quantity,
      price,
      brand,
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
      await connection.execute(insertImageQuery, [itemId, imagePath]);
    }

    console.log("Images inserted successfully");

    return res.redirect("/admin/products");
  } catch (error) {
    console.error("Error saving item:", error);
    errors.general = "Failed to add item";
    res.render("addeditproduct", { errors, product: "add" });
  } finally {
    // Release the connection
    connection.end();
  }
};

itemsController.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file received" });
  }

  // File was successfully uploaded
  return res.status(200).json({ message: "File uploaded successfully" });
};

export default itemsController;
