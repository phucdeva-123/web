const { Sequelize } = require("sequelize");
const express = require("express");
const sequelize = new Sequelize("world", "root", "phuc1234", {
  host: "localhost",
  dialect: "mysql",
});
const app = express();
const connect = (async function () {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
app.listen("3000", () => {
  console.log("listen from 3000");
});
