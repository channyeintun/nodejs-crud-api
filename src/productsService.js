// Import the necessary dependencies
const lodash = require("lodash");
const productsList = require("./products.json").products;
const { isNullish } = require("./utils");
const { v4 }=require("uuid"); 

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
            status: "404",
            error: "Not Found",
            message: "Todo item with id " + productId + " does not exist."
      }), product);
}

const saveProduct = (newProduct, done) => {
      let savedProduct = null;

      //to check required fields
      newProduct = {
            ...createProductSchema,
            ...newProduct
      }

      // check null value
      const isNull = isNullish(newProduct);
      if (!isNull) {
            const count = productsList.push({
                  id: v4(), // generate unique id using uuid4
                  ...newProduct
            });
            savedProduct = JSON.stringify(productsList[count - 1]);
      }

      return done(isNull ? JSON.stringify({
            status: "400",
            error: "Bad Request",
            message: "Properties cannot be null."
      }) : null, savedProduct);
}

const updateProduct = (productToUpdate, done) => {
      let updatedProduct = null;
      let isIndexExisted = null;
      //to check required fields
      productToUpdate = {
            ...updateProductSchema,
            ...productToUpdate
      }

      // check null value
      const isNull = isNullish(productToUpdate);
      if (!isNull) {

            const index = lodash.findIndex(productsList, productToUpdate);
            isIndexExisted = index !== null && index !== undefined;
            if (isIndexExisted) {
                  productsList[index] = productToUpdate;
                  updatedProduct = JSON.stringify(productsList[index]);
            }
      }

      const errorObj = isNull ? {
            status: "400",
            error: "Bad Request",
            message: "Properties cannot be null or not found."
      } : !isIndexExisted ? {
            status: "404",
            error: "Not Found",
            message: "Item not found on the list."
      } : null;

      return done(errorObj ? JSON.stringify(errorObj) : null, updatedProduct);
}

const deleteProduct = (productId, done) => {
      // delete a product
      lodash.remove(productsList, function (o) {
            return o.id === +productId;
      })
      return done(null, JSON.stringify({ message: "Successful request" }));
}


module.exports = {
      getProducts,
      getProductsById,
      saveProduct,
      updateProduct,
      deleteProduct
}