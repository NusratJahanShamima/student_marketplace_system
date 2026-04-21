const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../db');

// MULTER CONFIG 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


//GET PRODUCTS (LIST) 
router.get('/', (req, res) => {

    const { category, search, user_id } = req.query;

    let sql = "SELECT * FROM products WHERE 1=1";
    let values = [];

    
    if (user_id) {
        sql += " AND seller_id = ?";
        values.push(user_id);
    }

    
    if (category) {
        sql += " AND category = ?";
        values.push(category);
    }

   
    if (search) {
        sql += " AND title LIKE ?";
        values.push('%' + search + '%');
    }

    
    sql += " ORDER BY created_at DESC";

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json([]);
        }
        res.json(result);
    });
});



router.get('/:id', (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(result[0]);
    });
});


// ADD PRODUCT 
router.post('/add', upload.single('image'), (req, res) => {

    const { title, price, category, description, seller_id } = req.body;

    
    if (!seller_id) {
        return res.status(401).json({ success: false, message: "Login required" });
    }

    const image = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO products (title, price, category, image, description, seller_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [title, price, category, image, description, seller_id], (err) => {

        if (err) {
            console.error(err);
            return res.json({ success: false });
        }

        res.json({ success: true });
    });
});


// DELETE PRODUCT 
router.delete('/:id', (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], (err) => {

        if (err) {
            console.error(err);
            return res.json({ success: false });
        }

        res.json({ success: true });
    });
});


// SAVE PRODUCT
router.post('/save', (req, res) => {

    const { user_id, product_id } = req.body;

    
    if (!user_id || !product_id) {
        return res.status(400).json({
            success: false,
            message: "Invalid request"
        });
    }

    const sql = `
        INSERT INTO saved_products (user_id, product_id)
        VALUES (?, ?)
    `;

    db.query(sql, [user_id, product_id], (err) => {

        
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.json({
                    success: false,
                    message: "Already saved"
                });
            }

            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        res.json({
            success: true,
            message: "Saved successfully"
        });
    });
});


// UNSAVE PRODUCT
router.post('/unsave', (req, res) => {

    const { user_id, product_id } = req.body;

    const sql = `
        DELETE FROM saved_products
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(sql, [user_id, product_id], (err) => {

        if (err) {
            console.error(err);
            return res.json({ success: false });
        }

        res.json({ success: true });
    });
});

// GET SAVED PRODUCTS 
router.get('/saved/:user_id', (req, res) => {

    const user_id = req.params.user_id;

    const sql = `
        SELECT p.*
        FROM products p
        JOIN saved_products s ON p.id = s.product_id
        WHERE s.user_id = ?
        ORDER BY p.created_at DESC
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {
            console.error(err);
            return res.json([]);
        }

        res.json(result);
    });
});



module.exports = router;