const http = require("http");
const express = require("express");
const app = express();
const router = express.Router();
router.get("/", (req, res) => {
  res.write("");
});
app.use("/", router);
