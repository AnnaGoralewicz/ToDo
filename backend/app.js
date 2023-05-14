"use strict";

const logger = require("./logger");
const express = require("express");
const app = express();
const port = 3000;

var db = require("mariadb");
var cors = require("cors");
app.use(cors());

var pool = db.createPool({
  connectionLimit: 10,
  idleTimeout: 30,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: "TODO_DB",
});

// Stackoverflow serialize BigInt in json
BigInt.prototype["toJSON"] = function () {
  return parseInt(this.toString());
};

app.use(express.json());

app.get("/status", async (req, res) => {
  function pad(s) {
    return (s < 10 ? "0" : "") + s;
  }
  let uptime = process.uptime();
  let hours = Math.floor(uptime / (60 * 60));
  let minutes = Math.floor((uptime % (60 * 60)) / 60);
  let seconds = Math.floor(uptime % 60);
  let result = { uptime: pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) };
  logger.info(result);
  res.json(result);
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
    conn.end();
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

    conn.end();
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
    conn.end();
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
    conn.end();
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  logger.info("Start server");
});
