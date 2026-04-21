const express = require('express');
const router = express.Router();
const db = require('../db');


// GET CONVERSATIONS 
router.get('/conversations/:user_id', (req, res) => {

    const user_id = req.params.user_id;

    const sql = `
        SELECT DISTINCT
            m.product_id,
            p.title,

            CASE
                WHEN p.seller_id = ? THEN u.id
                ELSE p.seller_id
            END AS chat_user_id,

            CASE
                WHEN p.seller_id = ? THEN u.name
                ELSE s.name
            END AS chat_user_name

        FROM messages m

        JOIN products p ON p.id = m.product_id

        JOIN users u ON u.id = m.sender_id
        JOIN users s ON s.id = p.seller_id

        WHERE 
            p.seller_id = ? 
            OR m.sender_id = ?
    `;

    db.query(sql, [user_id, user_id, user_id, user_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.json([]);
        }
        res.json(result);
    });
});


// GET MESSAGES
router.get('/', (req, res) => {

    const { product_id, user_id } = req.query;

    if (!product_id || !user_id) {
        return res.json([]);
    }

    const sql = `
        SELECT *
        FROM messages
        WHERE product_id = ?
        AND (sender_id = ? OR receiver_id = ?)
        ORDER BY created_at ASC
    `;

    db.query(sql, [product_id, user_id, user_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.json([]);
        }
        res.json(result);
    });
});


// SEND MESSAGE
router.post('/send', (req, res) => {

    const { sender_id, receiver_id, product_id, message } = req.body;

    if (!sender_id || !receiver_id) {
        return res.status(401).json({ success: false });
    }

    if (!message || message.trim() === '') {
        return res.json({ success: false });
    }

    const sql = `
        INSERT INTO messages (sender_id, receiver_id, product_id, message, is_read)
        VALUES (?, ?, ?, ?, 0)
    `;

    db.query(sql, [sender_id, receiver_id, product_id, message], err => {
        if (err) {
            console.log(err);
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});


// COUNT MESSAGES 
router.get('/count/:user_id', (req, res) => {

    const user_id = req.params.user_id;

    const sql = `
        SELECT COUNT(*) AS total
        FROM messages
        WHERE sender_id = ? OR receiver_id = ?
    `;

    db.query(sql, [user_id, user_id], (err, result) => {
        if (err) return res.json({ total: 0 });
        res.json({ total: result[0].total });
    });
});
// UNREAD COUNT
router.get('/unread/:user_id', (req, res) => {

    const user_id = req.params.user_id;

    const sql = `
        SELECT COUNT(*) AS total
        FROM messages
        WHERE receiver_id = ? AND is_read = 0
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {
            console.error(err);
            return res.json({ total: 0 });
        }

        res.json({ total: result[0].total });
    });
});

//  MARK AS READ
router.post('/read', (req, res) => {

    const { user_id, product_id, sender_id } = req.body;

    const sql = `
        UPDATE messages
        SET is_read = 1
        WHERE receiver_id = ?
        AND sender_id = ?
        AND product_id = ?
    `;

    db.query(sql, [user_id, sender_id, product_id], (err) => {

        if (err) {
            console.error(err);
            return res.json({ success: false });
        }

        res.json({ success: true });
    });
});

module.exports = router;