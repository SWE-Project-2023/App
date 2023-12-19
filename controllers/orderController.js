import execute from "../queries/orderQueries.js";

const orderController = {
  getOrders: async (options) => {
    const result = await execute.getOrders(options);
    return result;
  },
  changeStatus: async (id) => {
    return await execute.changeStatus(id);
  },
  deleteOrder: async (id) => {
    return await execute.deleteOrder(id);
  },
};

export default orderController;
