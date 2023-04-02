"use strict";

const logger = require("./logger");
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  logger.info("req get");
  const todo = {
    todos: [
      { id: 1, text: "test", done: false },
      { id: 1, text: "test", done: false },
      { id: 1, text: "test", done: false },
      { id: 1, text: "test", done: true },
      { id: 1, text: "test", done: true },
    ],
  };

  res.send(todo);
});

app.listen(port, () => {
  logger.info("Start server");
});
