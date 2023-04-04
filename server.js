const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app.js");
const port = process.env.port || 8080;
const transaction = require("./models/transaction");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.set("strictQuery", true);
const client = mongoose
  //.connect(process.env.DATABASE_LOCAL,...)
  .connect(DB, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    //console.log(mongoose.connections);
    console.log("DB connection successful");
  });

app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
