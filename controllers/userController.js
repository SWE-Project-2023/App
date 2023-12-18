import execute from "../queries/userQueries.js";

const userController = {
  getUsers: async () => {
    return await execute.getAllUsers();
  },
  deleteUser: async (id) => {
    return await execute.deleteUser(id);
  },
  toggleAdmin: async (id) => {
    return await execute.toggleAdmin(id);
  },
  // Assuming execute.getUserDetails is a function that queries the database for user details

  getUserDetails: async (req, res) => {
    const userId = parseInt(req.body.userId);

    try {
      // Execute the query to get user details
      const results = await execute.getUserDetails(userId);

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Format the data and send it as JSON
      // Access the first element of the array
      const userDetail = results[0];

      const userDetails = {
        userId: userDetail.user_id,
        userFname: userDetail.user_fname,
        userLname: userDetail.user_Lname,
        email: userDetail.email,
        userAddress: userDetail.user_address,
        userIsAdmin: userDetail.user_isAdmin === 1, // Assuming 1 represents true and 0 represents false
        // Add more fields as needed
      };

      res.json(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  editUser: async (req, res) => {
    // Extract data from the request body
    const {
      userId,
      userFname,
      userLname,
      userEmail,
      userAddress,
      userIsAdmin,
    } = req.body;

    console.log("req.body", req.body);

    // Backend validation
    let errors = {};

    if (!userId || isNaN(userId)) {
      errors.general = "Invalid user ID";
    }

    if (!userFname || userFname.trim() === "") {
      errors.userFname = "Please enter the first name";
    }

    if (!userLname || userLname.trim() === "") {
      errors.userLname = "Please enter the last name";
    }

    if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      errors.userEmail = "Please enter a valid email address";
    }

    if (!userAddress || userAddress.trim() === "") {
      errors.userAddress = "Please enter the address";
    }

    // Additional validation for userIsAdmin, adjust as needed
    // For example, you might want to ensure it's a boolean value

    if (Object.keys(errors).length > 0) {
      // Return validation errors to the client
      console.log("Validation errors:", errors);
    }

    try {
      // Update the 'user' table
      await execute.updateUser(
        userId,
        userFname,
        userLname,
        userEmail,
        userAddress,
        userIsAdmin
        // Add more attributes as needed
      );

      console.log("User updated successfully");

      return res.redirect("/admin/users");
    } catch (error) {
      console.error("Error updating user:", error);
      errors.general = "Failed to update user";
      res.render("/admin/users", { errors });
    }
  },
};

export default userController;
