const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
  name: String,
  balance: Number,
});
const customer = mongoose.model("customer", Schema);
module.exports = customer;
