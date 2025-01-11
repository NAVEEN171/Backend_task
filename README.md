# Cryptocurrency Price Tracking API

A Node.js API that tracks and manages cryptocurrency price data using the CoinGecko API. The service automatically updates prices every 2 hours and provides endpoints for manual updates, price statistics, and price deviation calculations.

## Features

- Automatic price updates every 2 hours for Bitcoin, Ethereum, and Matic Network
- Manual price updates for specified cryptocurrencies
- Price statistics retrieval for individual coins
- Standard deviation calculation based on the last 100 price records

## Project Structure

```
├── controllers
│   └── cryptoControllers.js
├── routes
│   └── cryptoRoutes.js
├── utils
│   └── DBconnection.js
├── outputs
│   └── [output images]
└── .env
```

## API Endpoints

### 1. Get Coin Statistics
```
GET /stats
```
Query Parameters:
- `coin` (required): Name of the cryptocurrency (e.g., "bitcoin", "ethereum", "matic-network")

Response:
```json
{
    "Bitcoin_name": "bitcoin",
    "price": 65000,
    "marketCap": 1200000000,
    "24hchange": 2.5
}
```
## 2. Automatic Updates

The system automatically fetches and updates prices for Bitcoin, Ethereum, and Matic Network every 2 hours. This is handled by a scheduled task in `cryptoControllers.js`. The update process includes:
- Fetching current prices from CoinGecko API
- Updating existing records in MongoDB
- Creating new records for new cryptocurrencies


### 2. Manual Update Coin Details
```
POST /updateDetails
```
Request Body:
```json
{
    "Ids": ["bitcoin", "ethereum", "matic-network"]
}
```
Response:

    "data": [
        {
            "Bitcoin_name": "bitcoin",
            "price": 94177,
            "marketCap": 1865660382397.0576,
            "24hchange": -0.4990995526309869
        },
        {
            "Bitcoin_name": "ethereum",
            "price": 3227.83,
            "marketCap": 388882641487.2221,
            "24hchange": -2.023987905896996
        },
        {
            "Bitcoin_name": "matic-network",
            "price": 0.452693,
            "marketCap": 869916805.2622167,
            "24hchange": -1.8524489498372785
        }
    ]

```

### 3. Calculate Price Deviation
```
GET /deviation
```
Returns the standard deviation of prices based on the last 100 records.

Response:
```json
{
    "deviation": "1234.56"
}
```



```

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/crypto-tracking-api.git
```

2. Install dependencies
```bash
cd crypto-tracking-api
npm install
```

3. Set up environment variables as described above

4. Start the server
```bash
npm start
```

## Dependencies

- Express.js - Web framework
- Axios - HTTP client
- Mongoose - MongoDB object modeling
- dotenv - Environment variable management


