const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/apitesting", async (req, res) => {
    res.send("hello")
  });
app.listen(3100, () => {
    console.log("Server running on port 3100 http://localhost:3100/");
  });