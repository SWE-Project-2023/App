document.addEventListener("DOMContentLoaded", function () {
    // Get references to the form and form elements
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const usernameError = document.getElementById("username-error");
    const passwordError = document.getElementById("password-error");

    // Add an event listener for the form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from actually submitting

        // Get the values of the username and password fields
        const usernameValue = usernameInput.value;
        const passwordValue = passwordInput.value;

        // Check if either field is empty
        if (usernameValue === "") {
            usernameInput.classList.add("error");
            usernameError.textContent = "Username is required";
        } else {
            usernameInput.classList.remove("error");
            usernameError.textContent = "";
        }

        if (passwordValue === "") {
            passwordInput.classList.add("error");
            passwordError.textContent = "Password is required";
        } else {
            passwordInput.classList.remove("error");
            passwordError.textContent = "";
        }
    });
});
