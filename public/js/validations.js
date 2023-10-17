//login
document.addEventListener("DOMContentLoaded", function () {
    // Get references to the form and form elements
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
  
    // Add an event listener for the form submission
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from actually submitting
  
      // Get the values of the username and password fields
      const usernameValue = usernameInput.value;
      const passwordValue = passwordInput.value;
  
      // Check if either field is empty
      if (usernameValue === "" || passwordValue === "") {
        alert("Both username and password are required.");
      } else {
        // You can add code here to perform further actions, such as sending the data to a server for authentication.
        // For this example, we'll simply display an alert.
        alert("Login successful!");
      }
    });
  });
  