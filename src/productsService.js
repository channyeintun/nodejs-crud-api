// Import the necessary dependencies
const lodash = require("lodash");
const productsList = require("./products.json").products;
const { isNullish } = require("./utils");
const { v4 } = require("uuid");

const createProductSchema = {
      name: null,
      description: null,
      price: null,
      quantity: null
}

const updateProductSchema = {
      id: null,
      ...createProductSchema
}

const getProducts = () => {
      // get all products
      return JSON.stringify(productsList);
}

const getProductsById = (productId, done) => {
      let product = null

      // get a product by ID
      let result = lodash.filter(productsList, (item) => item.id === +productId);

      product = result.length ? JSON.stringify(result[0]) : null;

      return done(product ? null : JSON.stringify({
            status: 404,
            error: "Not Found",
            message: "Todo item with id " + productId + " does not exist."
      }), product);
}

const saveProduct = (newProduct, done) => {
      //to check required fields
      newProduct = {
            ...createProductSchema,
            ...newProduct,
            id: v4()
      }

      // check null value
      const isNull = isNullish(newProduct);
      if (!isNull) {
            productsList.push(newProduct);
      }

      return done(isNull ? JSON.stringify({
            status: 400,
            error: "Bad Request",
            message: "Properties cannot be null."
      }) : null, JSON.stringify(productsList));
}

const updateProduct = (productToUpdate, done) => {
      let isIndexExisted = null;
      //to check required fields
      productToUpdate = {
            ...updateProductSchema,
            ...productToUpdate
      }
      const index = lodash.findIndex(productsList, o => o.id === +productToUpdate.id);
      isIndexExisted = index !== -1;
      if (isIndexExisted) {
            productToUpdate = {
                  ...productsList[index],
                  ...productToUpdate,
                  id: productsList[index]["id"]
            }
            productsList[index] = productToUpdate;
      }

      const errorObj = !isIndexExisted ? {
            status: 404,
            error: "Not Found",
            message: "Item not found on the list."
      } : null;

      return done(errorObj ? JSON.stringify(errorObj) : null, JSON.stringify(productsList));
}

const deleteProduct = (productId, done) => {
      // delete a product
      const result = lodash.remove(productsList, function (o) {
            return o.id === +productId;
      });
      return done(result.length === 0 ? JSON.stringify({
            status: 400,
            error: "Bad Request",
            message: "Product does not exist."
      }) : null, JSON.stringify(productsList));
}


module.exports = {
      getProducts,
      getProductsById,
      saveProduct,
      updateProduct,
      deleteProduct
}