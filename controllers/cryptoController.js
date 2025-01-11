const axios = require("axios"); 
const mongoose=require("mongoose");
connection=mongoose.connection;
const DB = connection.useDb("Bitcoins");


const Coins = DB.collection("Currentprices");

//function to update given coins values 
async function fetchIds(Ids) {
  try {
    let idsList = Ids.join(",");
    let response = await axios.get("https://api.coingecko.com/api/v3/simple/price/", {
      headers: {
        x_cg_pro_api_key: process.env.KOINK_API_KEY,
      },
      params: {
        vs_currencies: "usd",
        ids: idsList,
        include_market_cap: true,
        include_24hr_change: true,
      },
    });

    if (response.data) {
      let newData = response.data;
      const transformData = Object.keys(newData).map(key => {
        return {
          Bitcoin_name: key,
          price: newData[key].usd,
          marketCap: newData[key].usd_market_cap,
          "24hchange": newData[key].usd_24h_change,
        };
      });

      if (transformData) {
        transformData.forEach(async (Coin) => {
          let coinSearch = await Coins.findOne({ Bitcoin_name: Coin.Bitcoin_name });
          if (!coinSearch) {
            await Coins.insertOne(Coin);
          }
           else {
            await Coins.updateOne(
              { Bitcoin_name: Coin.Bitcoin_name },
              {
                $set: {
                  price: Coin.price,
                  marketCap: Coin.marketCap,
                  "24hchange": Coin["24hchange"],
                },
              }
            );
          }
        });
      }

      return { data: transformData };
    }
  } 
  catch (error) {
    console.error(error);
    throw new Error('Error fetching data from external API');
  }
}

// Set an interval to fetch data for every 2 hours 
setInterval(() => {
  console.log("adding data");
  fetchIds(["bitcoin", "matic-network", "ethereum"]);
}, 1000 * 60 * 60 * 2);

// Controller function for /stats route
const getCoinStats = async (req, res) => {
  try {
    const coin = req.query.coin;
    if (coin) {
      let response = await Coins.findOne({ Bitcoin_name: coin });
      if (response) {
        delete response["_id"];
        return res.status(200).json(response);
      }
       else {
        return res.status(404).json({ msg: "No details for the specified coin" });
      }
    } 
    else {
      return res.status(400).json({ msg: "Coin parameter is required" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error fetching coin details" });
  }
};

// Controller function for /updateDetails route for manually updating the coin values 
const updateCoinDetails = async (req, res) => {
  try {
    const { Ids } = req.body;
    if (!Ids || !Array.isArray(Ids)) {
      return res.status(400).json({ msg: "Ids should be an array" });
    }
    let data = await fetchIds(Ids);
    if (data) {
      return res.status(200).json(data);
    } 
    else {
      return res.status(500).json({ msg: "Error fetching data" });
    }
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// Controller function for /deviation route for calculating the standard deviation of lastly added 100 records 
const calculateDeviation = async (req, res) => {
  try {
    const records = await Coins.find().sort({ timestamp: -1 }).limit(100).toArray();

    if (records.length === 0) {
      return res.status(404).json({ msg: "No records found for the requested cryptocurrency" });
    }

    const prices = records.map(record => record.price);
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const standardDeviation = Math.sqrt(variance);

    return res.status(200).json({
      deviation: standardDeviation.toFixed(2),
    });
  }
   catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error processing the request" });
  }
};


module.exports = {
  getCoinStats,
  updateCoinDetails,
  calculateDeviation
};
