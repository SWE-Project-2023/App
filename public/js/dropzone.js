Dropzone.autoDiscover = false;
let uploadedImagePaths = [];
$(document).ready(function async() {
  // Initialize Dropzone
  $('.delete-product-btn').click(function () {
    var productId = $(this).data('product-id');
    // Set the product ID for deletion in the confirmation modal
    $('#confirmDeleteProductBtn').data('product-id', productId);
  });

  // Handle confirmation modal delete button click
  $('#confirmDeleteProductBtn').click(function () {
    var productId = $(this).data('product-id');
    // Redirect or trigger the server-side deletion logic here
    window.location.href = '/admin/deleteProduct/' + productId;
  });
  let myDropzone = new Dropzone("#my-dropzone", {
    // Configuration options for Dropzone
    paramName: "file", // The name that will be used to transfer the file
    url: "/admin/upload", // The URL where the file should be uploaded
    maxFilesize: 5, // Maximum file size in megabytes
    acceptedFiles: ".jpg,.png,.gif,.webp,.jpeg", // Allowed file types
    autoProcessQueue: true,
    // Customized initialization function
    init: function () {
      let previewElement = document.getElementById("preview");

      this.on("addedfile", function (file) {
        // Action to be performed when a file is added
        console.log("File added: " + file.name);
        // Display the file thumbnail
        // You can replace this with your own desired action
        let reader = new FileReader();
        reader.onload = function (e) {
          let thumbnail = document.createElement("div");
          thumbnail.classList.add("thumbnail");
          thumbnail.setAttribute("data-dz-name", file.name); // Add a custom attribute with the file name
          thumbnail.setAttribute("data-file-id", file.upload.uuid); // Add a custom attribute with the file ID
          thumbnail.innerHTML =
            '<img src="' +
            e.target.result +
            '" style="max-width: 100px;" />' +
            '<button type = "button" class="btn btn-danger remove-btn">Remove</button>';
          previewElement.appendChild(thumbnail);
        };
        reader.readAsDataURL(file);
      });

      this.on("success", function (file, response) {
        console.log("File uploaded successfully: " + file.name);
        console.log("Server response: " + response);

        uploadedImagePaths.push(file.name);
        console.log(uploadedImagePaths[0]);
        // Update the preview element based on the server's response
      });

      this.on("error", function (file, errorMessage) {
        console.log("Error uploading file: " + file.name);
        console.log("Error message: " + errorMessage);
        // Update the preview element to indicate the error
        let errorText = document.createElement("p");
        errorText.innerHTML = "Upload Error: " + errorMessage;
        errorText.style.color = "red"; // Adjust the style as needed
      });

      // Attach event listener to the remove button
      previewElement.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-btn")) {
          e.stopPropagation(); // Stop event propagation to prevent triggering the parent click event
          let thumbnail = e.target.parentNode;
          let filename = thumbnail.getAttribute("data-dz-name");
          let fileId = thumbnail.getAttribute("data-file-id");

          // Make an AJAX request to delete the file from the server
          $.ajax({
            url: "/admin/delete",
            type: "POST",
            data: { filename: filename },
            success: function (response) {
              console.log("File deleted successfully: " + filename);
              console.log("Server response: " + response);
              // Find the file object by file ID
              uploadedImagePaths.splice(
                uploadedImagePaths.indexOf("public/images/" + filename),
                1
              );
              let fileObject = myDropzone.files.find(function (file) {
                return file.upload.uuid === fileId;
              });
              if (fileObject) {
                myDropzone.removeFile(fileObject); // Remove the file from Dropzone
              }
              thumbnail.remove(); // Remove the thumbnail from the preview element
            },
            error: function (xhr, status, error) {
              console.log("Error deleting file: " + filename);
              console.log("Error message: " + error);
            },
          });
        }
      });
      // Function to validate the uploaded images
      function validateImages() {
        console.log("validateImages() called");
        if (uploadedImagePaths.length === 0) {
          return false;
        }
        return true;
      }

      // Rest of the code...

      // Submit the form with AJAX
      $("#product-form").submit(function (event) {
        event.preventDefault();
        let isProductNameValid = validateProductName();
        let isBrandValid = validateBrand();
        let isCategoryValid = validateCategory();
        let isQuantityValid = validateQuantity();
        let isPriceValid = validatePrice();
        let isDescriptionValid = validateDescription();
        let isImagesValid = validateImages();
        let isOffersValid = validateOffers();
        if (
          !isProductNameValid ||
          !isBrandValid ||
          !isCategoryValid ||
          !isQuantityValid ||
          !isPriceValid ||
          !isDescriptionValid ||
          !isImagesValid ||
          !isOffersValid
        ) {
          console.log("Form is invalid");
          return false;
        } else {
          console.log("Form is valid");
        }

        let form = $(this);

        let formData = new FormData(form[0]);
        // Append the uploadedImagePaths to the form data
        formData.append(
          "uploadedImagePaths",
          JSON.stringify(uploadedImagePaths)
        );

        console.log("formData", formData);
        $.ajax({
          type: "POST",
          url: "/admin/createItem",
          data: formData,
          processData: false,
          contentType: false,
          success: function (response) {
            console.log("Form submitted successfully");
            console.log("Server response: " + response);
            // Handle success response
            // Replace the current page's content with the response
            document.documentElement.innerHTML = response;

            // Optionally, you can update the browser's history so the user can use the back button
            location.reload();
          },
          error: function (xhr, status, error) {
            console.log("Error submitting form");
            console.log("Error message: " + error);
            // Handle error response
          },
        });

        return false;
      });
    },
  });
});
$(document).ready(function () {
  let myDropzone = new Dropzone("#my-dropzoneedit", {
    // Configuration options for Dropzone
    paramName: "file", // The name that will be used to transfer the file
    url: "/admin/upload", // The URL where the file should be uploaded
    maxFilesize: 5, // Maximum file size in megabytes
    acceptedFiles: ".jpg,.png,.gif,.webp,jpeg", // Allowed file types
    autoProcessQueue: true,
    init: function () {
      let previewElement = document.getElementById("edit-preview");
      // Get the img elements and extract the src attribute
      let productImages = document.querySelectorAll("#previous-images img");
      for (let i = 0; i < productImages.length; i++) {
        let imageSrc = productImages[i].getAttribute("src");
        let imagePath = imageSrc.replace(/\//g, "/");
        let imagePathWithPublic = "public" + imagePath;
        console.log(imagePathWithPublic + " added to uploadedImagePaths");
        uploadedImagePaths.push(imagePathWithPublic);
      }
      this.on("addedfile", function (file) {
        // Action to be performed when a file is added
        console.log("File added: " + file.name);
        // Display the file thumbnail
        // You can replace this with your own desired action
        let reader = new FileReader();
        reader.onload = function (e) {
          let thumbnail = document.createElement("div");
          thumbnail.classList.add("thumbnail");
          thumbnail.setAttribute("data-dz-name", file.name); // Add a custom attribute with the file name
          thumbnail.setAttribute("data-file-id", file.upload.uuid); // Add a custom attribute with the file ID
          thumbnail.innerHTML =
            '<img src="' +
            e.target.result +
            '" style="max-width: 100px;" />' +
            '<button type = "button" class="btn btn-danger remove-button">Remove</button>';
          previewElement.appendChild(thumbnail);
        };
        reader.readAsDataURL(file);
      });

      this.on("success", function (file, response) {
        console.log("File uploaded successfully: " + file.name);
        console.log("Server response: " + response);
        uploadedImagePaths.push(file.name);
        console.log(uploadedImagePaths[0]);
        // Update the preview element based on the server's response
      });

      this.on("error", function (file, errorMessage) {
        console.log("Error uploading file: " + file.name);
        console.log("Error message: " + errorMessage);
        // Update the preview element to indicate the error
        let errorText = document.createElement("p");
        errorText.innerHTML = "Upload Error: " + errorMessage;
        errorText.style.color = "red"; // Adjust the style as needed
        previewElement.appendChild(errorText);
      });

      // Attach event listener to the remove button
      previewElement.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-button")) {
          e.stopPropagation(); // Stop event propagation to prevent triggering the parent click event
          let thumbnail = e.target.parentNode;
          let filename = thumbnail.getAttribute("data-dz-name");
          let fileId = thumbnail.getAttribute("data-file-id");

          // Make an AJAX request to delete the file from the server
          $.ajax({
            url: "/admin/delete",
            type: "POST",
            data: { filename: filename },
            success: function (response) {
              console.log("File deleted successfully: " + filename);
              console.log("Server response: " + response);
              // Find the file object by file ID
              uploadedImagePaths.splice(
                uploadedImagePaths.indexOf("public/images/" + filename),
                1
              );
              let fileObject = myDropzone.files.find(function (file) {
                return file.upload.uuid === fileId;
              });
              if (fileObject) {
                myDropzone.removeFile(fileObject); // Remove the file from Dropzone
              }
              thumbnail.remove(); // Remove the thumbnail from the preview element
            },
            error: function (xhr, status, error) {
              console.log("Error deleting file: " + filename);
              console.log("Error message: " + error);
            },
          });
        }
      });

      // Attach event listener to the remove button for previous images
      $("#previous-images").on("click", ".remove-btn", function () {
        let listItem = $(this).closest("li");
        let imagePath = listItem.find("img").attr("src");
        let imageName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
        // Make an AJAX request to delete the image from the server
        $.ajax({
          url: "/admin/delete",
          type: "POST",
          data: { filename: imageName },
          success: function (response) {
            console.log("Image deleted successfully: " + imageName);
            console.log("Server response: " + response);
            listItem.remove(); // Remove the image from the list

            // Remove the image path from the uploadedImagePaths array
            let index = uploadedImagePaths.indexOf(
              imageName
            );
            if (index !== -1) {
              console.log(
                "Removing image path: " +
                  "public/images/" +
                  imageName +
                  " from uploadedImagePaths"
              );
              uploadedImagePaths.splice(index, 1);
            }
          },
          error: function (xhr, status, error) {
            console.log("Error deleting image: " + imageName);
            console.log("Error message: " + error);
          },
        });
      });
      // Submit the form with AJAX
      $("#edit-product-form").submit(function (event) {
        event.preventDefault();

        // Validate form fields
        let isEditProductNameValid = validateEditProductName();
        let isEditBrandValid = validateEditBrand();
        let isEditCategoryValid = validateEditCategory();
        let isEditQuantityValid = validateEditQuantity();
        let isEditPriceValid = validateEditPrice();
        let isEditDescriptionValid = validateEditDescription();
        let isEditImagesValid = validateEditImages();
        let isEditOffersValid = validateEditOffers();

        if (
          !isEditProductNameValid ||
          !isEditBrandValid ||
          !isEditCategoryValid ||
          !isEditQuantityValid ||
          !isEditPriceValid ||
          !isEditDescriptionValid ||
          !isEditImagesValid ||
          !isEditOffersValid
        ) {
          console.log("Form is invalid");
          return false;
        }

        // Create FormData object
        let editForm = $(this);
        let editFormData = new FormData(editForm[0]);

        // Append the uploadedImagePaths to the form data
        editFormData.append(
          "uploadedImagePaths",
          JSON.stringify(uploadedImagePaths)
        );

        console.log("editFormData", editFormData);

        // AJAX request for form submission
        $.ajax({
          type: "POST",
          url: "/admin/editItem",
          data: editFormData,
          processData: false,
          contentType: false,
          success: function (response) {
            console.log("Edit form submitted successfully");
            console.log("Server response: " + response);
            // Handle success response
            // Replace the current page's content with the response
            document.documentElement.innerHTML = response;

            // Optionally, you can update the browser's history
            location.reload();
          },
          error: function (xhr, status, error) {
            console.log("Error submitting edit form");
            console.log("Error message: " + error);
            // Handle error response
          },
        });

        return false;
      });
    },
  });
  $(".edit-product-btn").click(function () {
    var productId = $(this).data("product-id");

    // Fetch product details based on productId using AJAX
    $.ajax({
      url: "/admin/getProductDetails", // Update this URL with your server endpoint
      method: "POST",
      data: { productId: productId },
      success: function (response) {
        console.log("Product details retrieved successfully:", response.productId)
        // Update the edit form fields with the retrieved data
        $("#edit-product-id").val(response.productId);
        $("#edit-product-name").val(response.productName);
        $("#edit-brand").val(response.brand);
        $("#edit-category").val(response.category);
        $("#edit-quantity").val(response.quantity);
        $("#edit-price").val(response.price);
        $("#edit-description").val(response.description);
        $("#edit-offers").val(response.offers);
        console.log("response.images", response.images);
        
        $("#previous-images").empty();
        let previewElement = document.getElementById("edit-preview");
        response.images.forEach(function (image) {
          let thumbnail = document.createElement("div");
          thumbnail.classList.add("thumbnail");
          thumbnail.setAttribute("data-dz-name", image); // Add a custom attribute with the file name
          thumbnail.setAttribute("data-file-id", image.uuid); // Add a custom attribute with the file ID
          thumbnail.innerHTML =
            '<img src="/images/' +
            image +
            '" style="max-width: 100px;" />' +
            '<button type = "button" class="btn btn-danger remove-button">Remove</button>';
          previewElement.appendChild(thumbnail);
          uploadedImagePaths.push(image);
        });
      },
      error: function (error) {
        console.error("Error fetching product details:", error);
      },
    });
  });
});

function validateImages() {
  if (uploadedImagePaths.length === 0) {
    let imagesError = document.getElementById("images-error");
    imagesError.innerHTML = "Please upload at least one image";
    return false;
  }
  return true;
}

function validateProductName() {
  console.log("validateProductName() called");
  let field = $("#productName").val().trim();
  let nameError = $("#name-error");
  let nameInput = $("#productName");

  if (field === "") {
    nameError.text("You must enter the product name!");
    nameInput.css("border-color", "red");
    return false;
  }
  nameError.text("");
  nameInput.css("border-color", "black");
  return true;
}

function validateBrand() {
  console.log("validateBrand() called");
  let field = $("#brand").val().trim();
  let brandError = $("#brand-error");
  let brandInput = $("#brand");

  if (field === "") {
    brandError.text("You must enter the brand!");
    brandInput.css("border-color", "red");
    return false;
  }
  brandError.text("");
  brandInput.css("border-color", "black");
  return true;
}

function validateCategory() {
  console.log("validateCategory() called");
  let selectedCategory = $("#category").val();
  let categoryError = $("#category-error");
  let categoryInput = $("#category");

  if (!selectedCategory) {
    categoryError.text("You must select a category!");
    categoryInput.css("border-color", "red");
    return false;
  }

  categoryError.text("");
  categoryInput.css("border-color", "black");
  return true;
}

function validateQuantity() {
  console.log("validateQuantity() called");
  let field = $("#quantity").val();
  let quantityError = $("#quantity-error");
  let quantityInput = $("#quantity");

  if (
    isNaN(field) ||
    !Number.isInteger(parseFloat(field)) ||
    parseInt(field) <= 0
  ) {
    quantityError.text(
      "Please enter a valid quantity (a positive whole number)."
    );
    quantityInput.css("border-color", "red");
    return false;
  }
  quantityError.text("");
  quantityInput.css("border-color", "black");
  return true;
}

function validatePrice() {
  console.log("validatePrice() called");
  let field = $("#price").val();
  let priceError = $("#price-error");
  let priceInput = $("#price");

  if (
    isNaN(field) ||
    parseFloat(field) <= 0 ||
    !/^\d+(\.\d{1,2})?$/.test(field)
  ) {
    priceError.text("Please enter a valid price (up to 2 decimal places).");
    priceInput.css("border-color", "red");
    return false;
  }
  priceError.text("");
  priceInput.css("border-color", "black");
  return true;
}

function validateDescription() {
  console.log("validateDescription() called");
  let field = $("#description").val().trim();
  let descriptionError = $("#description-error");
  let descriptionInput = $("#description");

  if (field === "") {
    descriptionError.text("You must enter the description!");
    descriptionInput.css("border-color", "red");
    return false;
  }
  descriptionError.text("");
  descriptionInput.css("border-color", "black");
  return true;
}

function validateEditImages() {
  // Get the ul element
  let previousImagesList = document.getElementById("edit-preview");

  // Count the number of li elements inside the ul
  let numberOfImages = previousImagesList.childElementCount;

  if (numberOfImages === 0) {
    let imagesError = document.getElementById("images-error");
    imagesError.innerHTML = "Please upload at least one image";
    return false;
  }

  return true;
}
function validateEditProductName() {
  let field = $("#edit-product-name").val().trim();
  let nameError = $("#edit-name-error");
  let nameInput = $("#edit-product-name");

  if (field === "") {
    nameError.text("You must enter the product name!");
    nameInput.css("border-color", "red");
    return false;
  }
  nameError.text("");
  nameInput.css("border-color", "black");
  return true;
}

function validateEditBrand() {
  let field = $("#edit-brand").val().trim();
  let brandError = $("#edit-brand-error");
  let brandInput = $("#edit-brand");

  if (field === "") {
    brandError.text("You must enter the brand!");
    brandInput.css("border-color", "red");
    return false;
  }
  brandError.text("");
  brandInput.css("border-color", "black");
  return true;
}

function validateEditCategory() {
  let selectedCategory = $("#edit-category").val();
  let categoryError = $("#edit-category-error");
  let categoryInput = $("#edit-category");

  if (!selectedCategory) {
    categoryError.text("You must select a category!");
    categoryInput.css("border-color", "red");
    return false;
  }

  categoryError.text("");
  categoryInput.css("border-color", "black");
  return true;
}

function validateEditQuantity() {
  let field = $("#edit-quantity").val();
  let quantityError = $("#edit-quantity-error");
  let quantityInput = $("#edit-quantity");

  if (
    isNaN(field) ||
    !Number.isInteger(parseFloat(field)) ||
    parseInt(field) <= 0
  ) {
    quantityError.text(
      "Please enter a valid quantity (a positive whole number)."
    );
    quantityInput.css("border-color", "red");
    return false;
  }
  quantityError.text("");
  quantityInput.css("border-color", "black");
  return true;
}

function validateEditPrice() {
  let field = $("#edit-price").val();
  let priceError = $("#edit-price-error");
  let priceInput = $("#edit-price");

  if (
    isNaN(field) ||
    parseFloat(field) <= 0 ||
    !/^\d+(\.\d{1,2})?$/.test(field)
  ) {
    priceError.text("Please enter a valid price (up to 2 decimal places).");
    priceInput.css("border-color", "red");
    return false;
  }
  priceError.text("");
  priceInput.css("border-color", "black");
  return true;
}

function validateEditDescription() {
  let field = $("#edit-description").val().trim();
  let descriptionError = $("#edit-description-error");
  let descriptionInput = $("#edit-description");

  if (field === "") {
    descriptionError.text("You must enter the description!");
    descriptionInput.css("border-color", "red");
    return false;
  }
  descriptionError.text("");
  descriptionInput.css("border-color", "black");
  return true;
}
function validateOffers() {
  let field = $("#offers").val();
  let offersError = $("#offers-error");
  let offersInput = $("#offers");

  if (
    isNaN(field) ||
    !Number.isInteger(parseFloat(field)) ||
    parseInt(field) < 0 ||
    parseInt(field) > 100
  ) {
    offersError.text("Please enter a valid offer percentage (0 to 100).");
    offersInput.css("border-color", "red");
    return false;
  }

  offersError.text("");
  offersInput.css("border-color", "black");
  return true;
}

function validateEditOffers() {
  let field = $("#edit-offers").val();
  let offersError = $("#edit-offers-error");
  let offersInput = $("#edit-offers");

  if (
    isNaN(field) ||
    !Number.isInteger(parseFloat(field)) ||
    parseInt(field) < 0 ||
    parseInt(field) > 100
  ) {
    offersError.text("Please enter a valid offer percentage (0 to 100).");
    offersInput.css("border-color", "red");
    return false;
  }

  offersError.text("");
  offersInput.css("border-color", "black");
  return true;
}
