import execute from "../queries/productQueries";

const productController = {
  searchItems: async (options) => {
    const result = await execute.searchItems(options);
    return result;
  },
};

export default productController;
