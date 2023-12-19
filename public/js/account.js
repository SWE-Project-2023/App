function validateAccountDetails() {
    var userId = document.getElementById("userId").value;
    var firstName = document.getElementById("fname").value;
    var lastName = document.getElementById("lname").value;
    var address = document.getElementById("address").value;

    console.log("User ID: " + userId);
    if (firstName === "" || lastName === "" || address === "") {
        alert("Please fill in all fields");
        return false;
    }

    // Create an object with the form data
    var formData = {
        id: userId,
        user_fname: firstName,
        user_Lname: lastName,
        user_address: address
    };

    // Make an AJAX request to the server
    fetch('/auth/changeAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server (e.g., show a success message)
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Prevent the form from submitting via the traditional way
    return false;
}
