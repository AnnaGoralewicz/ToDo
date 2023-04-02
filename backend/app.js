"use strict";

const logger = require("./logger");
const express = require("express");
const app = express();
const port = 3000;

var db = require("mariadb");

var pool = db.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "secret",
  database: "TODO_DB",
});

BigInt.prototype["toJSON"] = function () {
  return parseInt(this.toString());
};

app.use(express.json());

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

app.post("/add", (req, res) => {
  logger.info("add new todo");
  logger.debug(req.body);
  pool.getConnection().then((conn) => {
    conn
      .query("INSERT INTO TODO (description, done) VALUES(?, ?)", [
        req.body.description,
        false,
      ])
      .then((dbRes) => {
        logger.info("new todo entry ");
        res.json({
          id: dbRes.insertId,
          description: req.body.description,
          done: false,
        });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
      });
  });
});

app.listen(port, () => {
  logger.info("Start server");
});
