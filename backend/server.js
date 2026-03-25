const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mysql = require("mysql2/promise");
const { log } = require("node:console");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: "localhost",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.post("/api/create-user", async (req, res) => {
    const { name } = req.body;
    const sql = "INSERT INTO users (user_name) VALUES (?)";
    try {
        const [result] = await pool.execute(sql, [name]);
        if (result.affectedRows > 0) {
            res.status(201).json({ ok: true, message: "user created successfully" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ ok: false, message: "internal server error" });
    }
});

app.post("/api/check-user", async (req, res) => {
    const { name } = req.body;
    const sql = "SELECT * FROM users WHERE user_name = ?";
    const [row] = await pool.execute(sql, [name]);
    try {
    if (row[0]?.user_name === name) {
        res.status(200).json({ ok: true, message: "user exists" });
    } else {
        res.status(404).json({ ok: false, message: "user not exists" });
    } 
    } catch (e) {
        console.log(e);
        res.status(500).json({ ok: false, message: "internal server error" });
    }
});

app.listen(3000, "0.0.0.0", () => console.log("server running on port 3000"));