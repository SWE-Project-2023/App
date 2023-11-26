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
  }
};

export default userController;
