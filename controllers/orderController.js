import execute from "../queries/orderQueries.js";

const orderController = {
  getOrders: async (options) => {
    const result = await execute.getOrders(options);
    return result;
  },
};

export default orderController;
