const express = require("express");
const router = express.Router();

const Database = require("../db");
const db = new Database();

router.get("/", async (req, res) => {
    
    res.json({ message: "" });
});

module.exports = router;