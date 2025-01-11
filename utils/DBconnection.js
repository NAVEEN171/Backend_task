
const mongoose = require('mongoose');
require('dotenv').config(); 
 


function ConnectDB(){
   mongoose.connect(process.env.Mongo_DB_URL)
         .then(() => {
           console.log("Connected to MongoDB");
         })
         .catch((error) => {
           console.error("Error connecting to MongoDB:", error);
        });


const connection = mongoose.connection;



}

module.exports = ConnectDB;  
