require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const fetch = require('node-fetch');
const pollRouter = require("./pollRouter/pollRouter");
const restRouter = require("./restRouter/restRouter")
const voteRouter = require("./voteRouter/voteRouter")
const app = express();


const morganOption = NODE_ENV === "production";

app.use(morgan("combined"));
app.use(helmet());
app.get("/", (req, res) => {
  res.send("Hello, world!");
});
app.use(voteRouter)
app.use(pollRouter)
app.use(restRouter)
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    console.error(error);
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.use(cors());

module.exports = app;
