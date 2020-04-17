const productsDB = require("./database/products.json");
const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function formatStock(productStock) {
  let result = [];

  for (let [key, value] of Object.entries(productStock)) {
    result.push(`${key}[${value}]`);
  }

  return result.join(", ");
}

app.get("/", (req, res) => {
  res.status(200).send("Server is working.");
});

app.post("/webhook", (req, res) => {
  const requestedProduct =
    req.body.result && req.body.result.parameters && req.body.result.parameters["product-number"]
      ? req.body.result.parameters["product-number"]
      : "";

  const requestedSize =
    req.body.result && req.body.result.parameters && req.body.result.parameters["size"]
      ? req.body.result.parameters["size"]
      : "";

  if (requestedProduct && productsDB.hasOwnProperty(requestedProduct)) {
    return res.json({
      fulfillmentText: `"${productsDB[requestedProduct]["product-name"]}" Stock: ${
        requestedSize
          ? `${requestedSize}[${productsDB[requestedProduct]["product-stock"][requestedSize]}]`
          : formatStock(productsDB[requestedProduct]["product-stock"])
      }`,
      source: "webhook",
    });
  } else {
    return res.json({
      fulfillmentText: "Could not get results at this time.",
      source: "webhook",
    });
  }
});

app.listen(port, () => {
  console.log(`🌏 Server is running at http://localhost:${port}`);
});
