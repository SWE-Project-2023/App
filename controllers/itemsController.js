const itemsController = {};
import fs from "fs";
import path from "path";
import execute from "../queries/productQueries.js";
itemsController.createItem = async (req, res) => {
  // Extract data from the request body
  console.log("req.body", req.body);
  const { productName, category, brand, price, description, quantity, offers } =
    req.body;

  const uploadedImagePaths = JSON.parse(req.body.uploadedImagePaths);

  // Backend validation
  let errors = {};

  if (!productName || productName.trim() === "") {
    errors.productName = "Please enter the product name";
  }

  if (!price) {
    errors.price = "Please enter the price";
  } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
    errors.price =
      "Price must be a number with a maximum of two decimal places";
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

  if (!offers) {
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
    var rows = await execute.findProduct(productName);

    if (!rows) {
      console.error("Error details:", fields);
      throw new Error("Error executing query");
    } else if (rows.length > 0) {
      // Product with the same title already exists
      errors.productName = "Product with this title already exists";
      console.log("Product with the same title already exists");
      return res.render("/admin/products", { errors, product: "add" });
    }
    // Insert into the 'item' table
    let insertItemResult = await execute.insertItem(
      productName,
      category,
      brand,
      description,
      quantity,
      price,
      offers
    );
    const itemId = insertItemResult.insertId;
    console.log("Item inserted with ID:", itemId);

    // Insert into the 'item_images' table
    for (const imagePath of uploadedImagePaths) {
      console.log("Query parameters:", [itemId, imagePath]);
      await execute.insertImage(itemId, imagePath);
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

  try {
    // Execute the query
    const results = await execute.getProductDetails(productId);
   
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
  
    // Format the data and send it as JSON
    // Access the first element of the array
    const productDetail = results[0];

    const productDetails = {
      productId: productDetail.item_id,
      productName: productDetail.item_title,
      brand: productDetail.item_brand,
      category: productDetail.item_cat,
      description: productDetail.item_details,
      quantity: productDetail.item_quantity,
      price: productDetail.item_price,
      offers: productDetail.item_offers,
      images: results.map((result) => result.image_path).filter((image) => image !== null),
    };

    res.json(productDetails);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
itemsController.deleteImage = async (req, res) => {
  try {
    const { filename } = req.body;
    console.log("filename", filename);

    // Step 1: Define the path to the file
    // Step 2: Check if the file exists
    if (fs.existsSync("public/images/" + filename)) {
      // Step 3: Delete the file
      fs.unlink("public/images/" + filename, (error) => {
        if (error) {
          console.log("Error deleting file:", error);
          return res.status(500).send("Error deleting file");
        }

        console.log("File deleted successfully:", filename);
      });
    } else {
      console.log("File not found:", filename);
      // You can still proceed to delete from the database even if the file is not found
    }

    try {
      // Step 4: Remove the entry from the item_images table
      await execute.deleteImage(filename);
      // Step 5: Send the response after attempting to delete from the database
      res
        .status(200)
        .send("File and database entry deletion attempted successfully");
    } catch (dbError) {
      console.log("Error deleting database entry:", dbError);
      res.status(500).send("Error deleting database entry");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
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

  console.log("req.body", req.body);
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
    errors.price =
      "Price must be a number with a maximum of two decimal places";
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

  if (!offers) {
    errors.offers = "Please enter the offers";
  }
  if (Object.keys(errors).length > 0) {
    // Return validation errors to the client
    console.log("Validation errors:", errors);
    return res.render("addeditproduct", { errors, product: "edit" });
  }

  try {
    // Update the 'item' table

    await execute.updateItem(
      productId,
      productName,
      category,
      brand,
      description,
      quantity,
      price,
      offers
    );

    console.log("Item updated successfully");

    // Delete all existing images for the product
    await execute.deleteImages(productId);
    console.log("Existing images deleted successfully");

    // Insert into the 'item_images' table
    for (const imagePath of uploadedImagePaths) {
      console.log("Query parameters:", [productId, imagePath]);

      await execute.insertImage(productId, imagePath);
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

    const results = await execute.displayitem(productId);
 
    // Check if a product was found
    if (results.length > 0) {
    const product = results[0];
     console.log(product);
      res.render("itempage.ejs", {user: req.session.user===undefined?"":req.session.user, product });
    } else {
      // If no product is found, you might want to handle this case (e.g., show an error page)
      res.status(404).render("404.ejs", { user: req.session.user===undefined?"":req.session.user });
    }
  } catch (error) {
    console.log("n")
    console.error(error.message);
    // Handle any errors that occurred during the database query
    res.status(500).send("Internal Server Error");
  }


};
itemsController.getbyCategory = async(req,res)=>{

  try {
    const category = req.query.category;
    console.log(category)
    
    const results = await execute.getbyCategory(category);
    if (results.length > 0) {
      const products = results;
      console.log(results);
      res.render('productList.ejs', { user: req.session.user === undefined ? '' : req.session.user, products });
    } else {
      res.status(404).render('404.ejs', { user: req.session.user === undefined ? '' : req.session.user });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};
itemsController.addtoCart = async(req,res) =>{
  try{
    const itemId = req.body.itemId;
    const userId=req.body.userId;
    console.log(itemId);
    console.log(userId);
    const results = await execute.addtoCart(itemId,userId);
    console.log(results);
    if (results.length > 0) {
      const products = results[0];
    console.log(products);
      res.send(products);
    } else {
      res.status(404).render('404.ejs', { user: req.session.user === undefined ? '' : req.session.user });
    }
  }catch(error){
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
  };
  itemsController.additem = async(req,res)=>{
    const userId = req.body.userId;
    console.log("iddd "+userId);
    const results = await execute.additem(userId);
    if (results.length > 0) {
      const products = results;
      res.render('cart.ejs', { user: req.session.user === undefined ? '' : req.session.user ,products});
    } else {
      res.status(404).render('404.ejs', { user: req.session.user === undefined ? '' : req.session.user });
    }
  };

  itemsController.getCart = async(req,res)=>{
    const userId = req.session.user.user_id;
    const results = await execute.getCart(userId);
    if (results.length > 0) {
      const products = results;
      res.render('cart.ejs', { user: req.session.user === undefined ? '' : req.session.user ,products});
    } else {
      res.status(404).render('404.ejs', { user: req.session.user === undefined ? '' : req.session.user });
    }
  };

  itemsController.deleteitem = async(req,res)=>{
    const userId = req.session.user.user_id;
    const productId = req.body.productId;
    const results = await execute.deleteitem(userId,productId);
    try{
    res.json({ success: true, message: 'Item deleted from cart' });
  } catch (error) {
      console.error('Error deleting item from cart:', error);
      // Send an error response
      res.status(500).json({ success: false, message: 'Error deleting item from cart' });
  }
  };

export default itemsController;
