//Import the necessary dependencies
const http = require('http');

const dotenv = require('dotenv');
dotenv.config();

// Define a prot at which the server will run
const PORT = process.env.PORT || 5000;

const productsService = require("./productsService");
const { getRequestData, done } = require('./utils');

const server = http.createServer(async (req, res) => {
      // Get all products
      if (req.url === "/products" && req.method === "GET") {
            res.writeHead(200, {
                  "Content-Type": "application/json"
            });
            res.write(productsService.getProducts());
            res.end();
      } else if (req.url.match(/\/products\/\d*/) && req.method === "GET") {
            // Get a product with specified id
            //retrieve id from url
            const tokens = req.url.split("/");
            const product_id = tokens[tokens.length - 1];

            const result = productsService.getProductsById(product_id, done);

            res.writeHead(result['status'] || 200, {
                  "Content-Type": "application/json"
            });
            res.write(result);
            res.end();
      } else if (req.url === "/products" && req.method === "POST") {
            // Create a new product
            const requestData = await getRequestData(req);
            let result = productsService.saveProduct(JSON.parse(requestData), done);
            res.writeHead(result['status'] || 200, {
                  "Content-Type": "application/json"
            });
            res.write(result);
            res.end();
      } else if (req.url.match(/\/products\/\d*/) && req.method === "PUT") {
            // Update a specific product
            const requestData = await getRequestData(req);

            //retrieve id from url
            const tokens = req.url.split("/");
            const product_id = tokens[tokens.length - 1];

            const existingProduct = productsService.getProductsById(product_id, done);

            const productToUpdate = {
                  ...JSON.parse(existingProduct),
                  ...JSON.parse(requestData)
            }

            const result = productsService.updateProduct(productToUpdate, done);

            res.writeHead(result['status'] || 200, {
                  "Content-Type": "application/json"
            });
            res.write(result);
            res.end();
      } else if (req.url.match(/\/products\/\d*/) && req.method === "DELETE") {
            // Delete a product
            //retrieve id from url
            const tokens = req.url.split("/");
            const product_id = tokens[tokens.length - 1];

            const result = productsService.deleteProduct(product_id, done);

            res.writeHead(result['status'] || 200, {
                  "Content-Type": "application/json"
            });
            res.write(result);
            res.end();
      } else {
            // for 404 routes
            res.writeHead(404, {
                  "Content-Type": "application/json"
            });
            res.write(JSON.stringify({
                  status: 404,
                  error: "Not Found",
                  message: "Resource cannot be found."
            }))
            res.end();
      }

});

// listen for client requests
server.listen(PORT, () => {
      console.log(`server started on port: ${PORT}`);
})

server.on("error", (error) => {
      if (error.code === "EADRINUSE") {
            console.log("Port already in use")
      }
})