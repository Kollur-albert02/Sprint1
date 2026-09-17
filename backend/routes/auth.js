const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (email, password)
            VALUES (?, ?)
        `;

        db.run(sql, [email, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({
                        message: "Email already exists"
                    });
                }

                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.status(201).json({
                message: "User registered successfully",
                userId: this.lastID
            });
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.get(sql, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        res.status(200).json({
            message: "Login successful",
            userId: user.id,
            email: user.email
        });
    });
});
