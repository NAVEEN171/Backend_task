const express = require("express");
const cryptoController = require("../controllers/cryptoController");

const router = express.Router();

router.get("/stats", cryptoController.getCoinStats);

//It is a route for manually updating the details of the Coins 
//there is a automatic function that runs for every 2 hours to update the coins values in cryptoControlller
router.post("/updateDetails", cryptoController.updateCoinDetails);

router.get("/deviation", cryptoController.calculateDeviation);

module.exports = router;
