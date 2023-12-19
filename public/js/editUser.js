// editUser.js

$(document).ready(function () {
  $('.delete-user-btn').click(function () {
    var userId = $(this).data('user-id');
    // Set the user ID for deletion in the confirmation modal
    $('#confirmDeleteBtn').data('user-id', userId);
  });

  // Handle confirmation modal delete button click
  $('#confirmDeleteBtn').click(function () {
    var userId = $(this).data('user-id');
    // Redirect or trigger the server-side deletion logic here
    window.location.href = '/admin/users/delete/' + userId;
  });
  
  $(".edit-user-btn").click(function () {
    var userId = $(this).data("user-id");

    // Fetch user details based on userId using AJAX
    $.ajax({
      url: "/admin/getUserDetails", // Update this URL with your server endpoint
      method: "POST",
      data: { userId: userId },
      success: function (response) {
        console.log("User details retrieved successfully:", response.userId);
        // Update the edit form fields with the retrieved data
        $("#edit-user-id").val(response.userId);
        $("#edit-user-fname").val(response.userFname);
        $("#edit-user-lname").val(response.userLname);
        $("#edit-user-email").val(response.email);
        $("#edit-user-address").val(response.userAddress);
        $("#edit-user-admin").prop("checked", response.userIsAdmin);

        // You can customize the code below based on your requirements
        // Example: Display a message
      },
      error: function (error) {
        console.error("Error fetching user details:", error);
      },
    });
  });

  // You can add more event handlers or functions related to the edit user functionality here
  // For example, handling form submission and sending updated user details to the server
  $("#edit-user-form").submit(function (event) {
    console.log("Edit user form submitted");
    event.preventDefault();
  
    // Validate form fields (modify the validation functions accordingly)
    let isEditUserFnameValid = validateEditUserFname();
    let isEditUserLnameValid = validateEditUserLname();
    let isEditUserEmailValid = validateEditUserEmail();
    let isEditUserAddressValid = validateEditUserAddress();

    if (
      !isEditUserFnameValid ||
      !isEditUserLnameValid ||
      !isEditUserEmailValid ||
      !isEditUserAddressValid 
    ) {
      console.log("Form is invalid");
      return false;
    }
  
    // Create FormData object
    let editUserFormData = {
      userId: $("#edit-user-id").val(),
      userFname: $("#edit-user-fname").val(),
      userLname: $("#edit-user-lname").val(),
      email: $("#edit-user-email").val(),
      userAddress: $("#edit-user-address").val()
    };

    console.log("editUserFormData", editUserFormData);
  
    // AJAX request for form submission
    $.ajax({
      type: "POST",
      url: "/admin/editUser",
      data: JSON.stringify(editUserFormData),
      contentType: 'application/json',
      success: function (response) {
        console.log("Edit user form submitted successfully");
        console.log("Server response: " + response);
        // Handle success response
        // Replace the current page's content with the response
        document.documentElement.innerHTML = response;
  
        // Optionally, you can update the browser's history
        location.reload();
      },
      error: function (xhr, status, error) {
        console.log("Error submitting edit user form");
        console.log("Error message: " + error);
        // Handle error response
      },
    });
  
    return false;
  });  
});
function validateEditUserFname() {
  let field = $("#edit-user-fname").val().trim();
  let fnameError = $("#edit-fname-error");
  let fnameInput = $("#edit-user-fname");

  if (field === "") {
    fnameError.text("You must enter the first name!");
    fnameInput.css("border-color", "red");
    return false;
  }
  fnameError.text("");
  fnameInput.css("border-color", "black");
  return true;
}

function validateEditUserLname() {
  let field = $("#edit-user-lname").val().trim();
  let lnameError = $("#edit-lname-error");
  let lnameInput = $("#edit-user-lname");

  if (field === "") {
    lnameError.text("You must enter the last name!");
    lnameInput.css("border-color", "red");
    return false;
  }
  lnameError.text("");
  lnameInput.css("border-color", "black");
  return true;
}

function validateEditUserEmail() {
  let field = $("#edit-user-email").val().trim();
  let emailError = $("#edit-email-error");
  let emailInput = $("#edit-user-email");

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(field)) {
    emailError.text("Please enter a valid email address.");
    emailInput.css("border-color", "red");
    return false;
  }
  emailError.text("");
  emailInput.css("border-color", "black");
  return true;
}

function validateEditUserAddress() {
  let field = $("#edit-user-address").val().trim();
  let addressError = $("#edit-address-error");
  let addressInput = $("#edit-user-address");

  if (field === "") {
    addressError.text("You must enter the address!");
    addressInput.css("border-color", "red");
    return false;
  }
  addressError.text("");
  addressInput.css("border-color", "black");
  return true;
}