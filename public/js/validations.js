document.addEventListener("DOMContentLoaded", function () {
    // Get references to the form and form elements
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");

    // Add an event listener for the form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from actually submitting

        // Get the values of the email and password fields
        const emailValue = emailInput.value;
        const passwordValue = passwordInput.value;

        // Check if either field is empty
        if (emailValue === "") {
            emailInput.classList.add("error");
            emailError.textContent = "email is required";
            return false;
        } else {
            emailInput.classList.remove("error");
            emailError.textContent = "";
        }

        if (passwordValue === "") {
            passwordInput.classList.add("error");
            passwordError.textContent = "Password is required";
            return false;
        } else {
            passwordInput.classList.remove("error");
            passwordError.textContent = "";
        }
        event.target.submit();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Get references to the form and form elements
    const signupForm = document.getElementById("form-main"); // Changed the form ID to class
    const firstnameInput = document.getElementById("firstname");
    const lastnameInput = document.getElementById("lastname");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword"); // Added confirm password field
    const firstnameError = document.getElementById("firstname-error");
    const lastnameError = document.getElementById("lastname-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const confirmPasswordError = document.getElementById("confirmpassword-error"); // Added confirm password error field

    // Add an event listener for the form submission
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from actually submitting

        // Get the values of the input fields
        const firstnameValue = firstnameInput.value;
        const lastnameValue = lastnameInput.value;
        const emailValue = emailInput.value;
        const passwordValue = passwordInput.value;
        const confirmPasswordValue = confirmPasswordInput.value; // Get confirm password value

        // Check if the Firstname is empty
        if (firstnameValue === "") {
            firstnameInput.classList.add("error");
            firstnameError.textContent = "Firstname is required";
            return false;
        } else {
            firstnameInput.classList.remove("error");
            firstnameError.textContent = "";
        }

        // Check if the Lastname is empty
        if (lastnameValue === "") {
            lastnameInput.classList.add("error");
            lastnameError.textContent = "Lastname is required";
            return false;
        } else {
            lastnameInput.classList.remove("error");
            lastnameError.textContent = "";
        }

        // Check if the Email is empty and validate its format (basic email validation)
        if (emailValue === "") {
            emailInput.classList.add("error");
            emailError.textContent = "Email is required";
            return false;
        } else if (!isValidEmail(emailValue)) {
            emailInput.classList.add("error");
            emailError.textContent = "Please enter a valid email address";
            return false;
        } else {
            emailInput.classList.remove("error");
            emailError.textContent = "";
        }

        // Check if the Password is empty
        if (passwordValue === "") {
            passwordInput.classList.add("error");
            passwordError.textContent = "Password is required";
            return false;
        } else {
            passwordInput.classList.remove("error");
            passwordError.textContent = "";
        }

        // Check if the Confirm Password matches the Password
        if (confirmPasswordValue === "") {
            confirmPasswordInput.classList.add("error");
            confirmPasswordError.textContent = "Please confirm your password";
            return false;
        } else if (confirmPasswordValue !== passwordValue) {
            confirmPasswordInput.classList.add("error");
            confirmPasswordError.textContent = "Passwords do not match";
            return false;
        } else {
            confirmPasswordInput.classList.remove("error");
            confirmPasswordError.textContent = "";
        }
        event.target.submit();
    });

    // Function to validate email format
    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }
});

