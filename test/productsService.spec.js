const { expect } = require("chai");

const productsService = require("../src/productsService");

const { done } = require("../src/utils");

describe("Testing productService methods", function () {
      it("Testing get all the products", function () {
            let products = JSON.parse(productsService.getProducts());

            expect(products).to.be.an("Array");
            expect(products.length).to.be.equal(4);
            expect(products[0].name).to.be.equal("LED Monitor");
            expect(products[1].name).to.be.equal("Power Bank");
            expect(products[2].name).to.be.equal("Optical Mouse");
            expect(products[3].name).to.be.equal("Wireless Keyboard");
            done(null);
      });

      it("Testing get product by Id with valid productId", function () {
            productsService.getProductsById(2, (err, result) => {
                  let product = JSON.parse(result);

                  expect(err).to.be.equal(null);
                  expect(product).to.be.an("Object");
                  expect(product.id).to.be.equal(2);
                  expect(product.name).to.be.equal("Power Bank");
                  done(err);
            });
      });

      it("Testing get product by Id with invalid productId", function () {
            productsService.getProductsById(9, (err, result) => {
                  err = JSON.parse(err);
                  expect(err).to.not.be.equal(null);
                  expect(err.status).to.be.equal(404);
                  done(null);
            });
      });

      it("Testing save product by providing new product", function () {

            let newProduct = {
                  name: "Fridge",
                  description: "A fridge to store food",
                  price: 10000,
                  quantity: 10
            }

            productsService.saveProduct(newProduct, (err, result) => {
                  let products = JSON.parse(result);
                  expect(err).to.be.equal(null);
                  expect(products.length).to.be.equal(5);
                  expect(products[0].name).to.be.equal("LED Monitor");
                  expect(products[1].name).to.be.equal("Power Bank");
                  expect(products[2].name).to.be.equal("Optical Mouse");
                  expect(products[3].name).to.be.equal("Wireless Keyboard");
                  expect(products[4].name).to.be.equal("Fridge");
                  done(err);
            });
      });

      it("Test update product with valid productId", function () {
            let updateData = {
                  id: 3,
                  name: "Mobile",
                  description: "A mobile to operate",
                  price: 100000,
                  quantity: 5
            }

            productsService.updateProduct(updateData, (err, result) => {
                  let products = JSON.parse(result);
                  expect(err).to.be.equal(null);
                  expect(products[2].id).to.be.equal(3);
                  expect(products[2].name).to.be.equal("Mobile");
                  expect(products[2].price).to.be.equal(100000);
                  done(null);
            });
      });

      it("Test update product with invalid productId", function () {
            let updateData = {
                  id: 10,
                  name: "Mobile",
                  description: "A mobile to operate",
                  price: 100000,
                  quantity: 5
            }

            productsService.updateProduct(updateData, (err, result) => {
                  err = JSON.parse(err);
                  expect(err.status).to.be.equal(404);
                  done(null);
            });
      });

      it("Test delete product with valid productId", function () {
            productsService.deleteProduct(3, (err, result) => {
                  let products = JSON.parse(result);

                  expect(err).to.be.equal(null);
                  expect(products.length).to.be.equal(4);
                  expect(products[0].name).to.be.equal("LED Monitor");
                  expect(products[1].name).to.be.equal("Power Bank");
                  expect(products[2].name).to.be.equal("Wireless Keyboard");
                  expect(products[3].name).to.be.equal("Fridge");
                  done(null);
            });
      });

      it("Test delete product with invalid productId", function () {
            productsService.deleteProduct(10, (err, result) => {
                  err = JSON.parse(err);
                  expect(err.message).to.be.equal("Product does not exist.");
                  done(null);
            });
      });
});