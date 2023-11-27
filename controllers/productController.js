import execute from "../queries/productQueries.js";

const productController = {
  searchItems: async (options) => {
    const result = await execute.searchItems(options);
    return result;
  },
};

export default productController;
