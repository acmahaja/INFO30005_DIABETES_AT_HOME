require('dotenv').config()    // for database login details
const mongoose = require("mongoose")

//THIS USES MY TESTING LOGIN INFO ON ATLAS
if (process.env.PORT) {  // are we running on Heroku?
  // login details retrieved from environment variables
  connectionString = "mongodb+srv://grosa:bananabanana@cluster0.ow6of.mongodb.net/Diabetes?retryWrites=true&w=majority"
  dbAddress = connectionString.replace("<username>",process.env.MONGO_USERNAME).replace("<password>",process.env.MONGO_PASSWORD)
} else {  // we are running locally
  dbAddress = "mongodb+srv://grosa:bananabanana@cluster0.ow6of.mongodb.net/Diabetes?retryWrites=true&w=majority"
}

try {
  // Connect to the MongoDB cluster
   mongoose.connect(
    dbAddress,
    { useNewUrlParser: true, 
        useUnifiedTopology: true, 
        //useCreateIndex: true, 
       // useFindAndModify: false, 
        dbName: "Diabetes"},
    () => console.log(" Mongoose is connected")
  );

} catch (e) {
  console.log(e);
}

const db = mongoose.connection

db.on("error", err => {
  console.log("db errorrr")
  console.error(err);
  process.exit(1)
})

db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port)
})

require("./patient_settings")
require("./patient")
require("./health_data")
require("./clincian")


