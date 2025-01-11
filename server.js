const express = require("express");
require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const ConnectDB = require("./utils/DBconnection");
const cryptocurrencyRoutes = require("./routes/cryptoRoutes"); 


const app = express();

app.use(express.json());


//mongoDb connection
ConnectDB();

app.use("/",cryptocurrencyRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
