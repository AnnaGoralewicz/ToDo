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

// Stackoverflow serialize BigInt in json
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

/**
 * adding new entry (Create)
 */
app.post("/add", async (req, res) => {
  logger.info("add new todo");

  try {
    let conn = await pool.getConnection();
    const dbRes = await conn.query(
      "INSERT INTO TODO (description, done) VALUES(?, ?)",
      [req.body.description, false]
    );
    res.json({
      id: dbRes.insertId,
      description: req.body.description,
      done: false,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * listed alle todos auf (Read)
 */
app.get("/list", async (req, res) => {
  logger.info("list todo");
  try {
    let conn = await pool.getConnection();
    const rows = await conn.query("select * from TODO");
    res.json({
      todos: rows,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// ändert eintrag (Update)
app.post("/update", async (req, res) => {
  logger.info("Update todo");

  try {
    let conn = await pool.getConnection();
    const dbRes = await conn.query(
      " UPDATE TODO SET description=? , done= ? WHERE id=?",
      [req.body.description, req.body.done, req.body.id]
    );
    res.json({
      id: req.body.id,
      description: req.body.description,
      done: req.body.done,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// ändert eintrag (Delete)
app.delete("/delete", async (req, res) => {
  logger.info("Update todo");

  try {
    let conn = await pool.getConnection();
    const dbRes = await conn.query(" DELETE FROM TODO  WHERE id=?", [
      req.body.id,
    ]);
    res.json({
      status: "OK",
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  logger.info("Start server");
});
