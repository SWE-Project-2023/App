const itemsController = {};
import fs from "fs";
import path from "path";
import execute from "../queries/productQueries.js";
function calculateSubtotal(products) {
  let subtotal = 0;

  // Loop through each product and add its price multiplied by quantity to the subtotal
  products.forEach((product) => {
      subtotal += product.item_price * product.quantity;
  });

  // Return the formatted subtotal
  return subtotal.toFixed(2);
}
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
    return res.render("/admin/products", { errors, product: "add" });
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
itemsController.viewProducts = async (req, res) => {
  try {
    var products = await execute.searchItems({
      item_id: req.query.id,
      item_title: req.query.title,
      item_brand: req.query.brand,
      item_cat: req.query.category,
      item_price_min: req.query.price_min,
      item_price_max: req.query.price_max,
      item_qty_min: req.query.qty_min,
      item_qty_max: req.query.qty_max,
    });
    if (products.length > 0) {
      res.render("productsList.ejs", { user: req.session.user===undefined?"":req.session.user, products });
    } else {
      res.render("productsList.ejs", { user: req.session.user===undefined?"":req.session.user,products });
    }
  } catch (error) {
    console.error(error.message);
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
      res.render('productLists.ejs', { user: req.session.user === undefined ? '' : req.session.user, products });
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
      res.render('cart.ejs', { user: req.session.user === undefined ? '' : req.session.user ,products});
    }
  };

  itemsController.getCart = async (req, res) => {
    // Check if user session exists
    if (req.session.user && req.session.user.user_id) {
        const userId = req.session.user.user_id;
        const results = await execute.getCart(userId) ?? 0;
      console.log("results are: " + results);
        let products = [];

        if (results.length > 0) {
            products = results;
        }

        // Calculate subtotal in the controller
        const subtotal = calculateSubtotal(products);

        res.render('cart.ejs', { user: req.session.user === undefined ? '' : req.session.user, products, subtotal });
    } else {
        // Render 404 if user session is not established
        res.status(404).render('404.ejs', { user: req.session.user === undefined ? '' : req.session.user });
    }
};


  

  itemsController.deleteitem = async(req,res)=>{
    const userId = req.session.user.user_id;
    const productId = req.body.productId;
    const results = await execute.deleteitem(userId,productId);
    try{
      res.status(200).json({ success: true, message: 'Quantity updated successfully' });
  } catch (error) {
      console.error('Error deleting item from cart:', error);
      // Send an error response
      res.status(500).json({ success: false, message: 'Error deleting item from cart' });
  }
  };
  itemsController.deleteProduct = async (id) => {
    try {
  
      const productId = id;
  
      // Step 1: Retrieve all images associated with the product
      const images = await execute.getImagesByProductId(productId);
      
      // Log the images retrieved
      console.log('Images associated with product:', images);
  
      // Step 2: Delete and unlink each image
      for (const image of images) {
        const imagePath = image.image_path;
  
        if (fs.existsSync("public/images/" + imagePath)) {
          fs.unlink("public/images/" + imagePath, (error) => {
            if (error) {
              console.log("Error deleting file:", error);
              // Handle the error if necessary
            } else {
              console.log("File deleted successfully:", imagePath);
            }
          });
        }
  
        // Log the image deletion from the database
        console.log('Deleting image from the database:', imagePath);
  
        // Step 3: Delete the image from the database
        await execute.deleteImageByPath(imagePath);
      }
  
      // Log the product deletion from the database
      console.log('Deleting product from the database:', productId);
  
      // Step 4: Delete the product from the database
      await execute.deleteProduct(productId);
      
    } catch (error) {
      // Log any errors that occur during the deletion process
      console.error('Error deleting product:', error);
      
    }
  };

  itemsController.updateCartItemQuantity = async (req, res) => {
    const { productId, newQuantity } = req.body;
    const userId = req.session.user.user_id; // Assuming user information is stored in the session
  
    try {
      // Update the quantity in the database
      const updateResult = await execute.updateCartItemQuantity(userId, productId, newQuantity);
  
      // Check if the update was successful
     
        res.status(200).json({ success: true, message: 'Quantity updated successfully' });
      
    } catch (error) {
      console.error('Error updating item quantity:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  itemsController.addtoWishlist =async (req, res) => {
    const productId=req.body.productId;
    const userId=req.body.userId;
    console.log(productId);
    console.log(userId);
    
    try {
      // Update the quantity in the database
      const result = await execute.addtoWishlist(userId, productId);
  
      // Check if the update was successful
      if (result.length > 0) {
      const products = result[0];
      console.log(products);
        res.send(products);
      } else {
        res.status(404).render('404.ejs', { user: req.session.user === undefined ? '' : req.session.user });
      }
       
      
    } catch (error) {
      console.error(error.message);
    res.status(500).send('Internal Server Error');
    }
  };
  itemsController.getwishlist = async(req,res)=>{
    if (req.session.user && req.session.user.user_id) {
      const userId = req.session.user.user_id;
      const results = await execute.getwishlist(userId);
      let products = [];
      if (results.length > 0) {
          products = results;
          console.log(products);
      }
      res.render('wishlist.ejs', { user: req.session.user === undefined ? '' : req.session.user, products });
  } else {
      // Render 404 if user session is not established
      res.status(404).render('404.ejs', { user: req.session.user === undefined ? '' : req.session.user });
  }
  };
  itemsController.deleteWishlistItem = async(req,res)=>{
    if (req.session.user && req.session.user.user_id) {
      const userId = req.session.user.user_id;
      const product = req.body.productId;
      const results = await execute.deleteWishlistItem(userId,product);

      res.status(200).send("sent");
  } else {
      // Render 404 if user session is not established
      res.status(404).render('404.ejs', { user: req.session.user === undefined ? '' : req.session.user });
  }
  };
  
  
  
export default itemsController;
