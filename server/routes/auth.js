const express = require('express');
const router = express.Router();
const db = require('../db');

// REGISTER
router.post('/register', (req, res) => {

    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
        return res.json({ success: false, message: "All fields required" });
    }

    // check if user exists
    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }

        if (result.length > 0) {
            return res.json({ success: false, message: "Email already exists" });
        }

        // insert user
        const insertSql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        db.query(insertSql, [name, email, password], (err) => {

            if (err) {
                console.error(err);
                return res.status(500).json({ success: false });
            }

            res.json({ success: true, message: "Registered successfully" });
        });
    });
});


// LOGIN
router.post('/login', (req, res) => {

    const { email, password } = req.body;

    // validation
    if (!email || !password) {
        return res.json({ success: false, message: "All fields required" });
    }

    const sql = "SELECT id, name, email FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }

        if (result.length > 0) {
            res.json({
                success: true,
                user: result[0]   
            });
        } else {
            res.json({
                success: false,
                message: "Invalid email or password"
            });
        }
    });
});

module.exports = router;