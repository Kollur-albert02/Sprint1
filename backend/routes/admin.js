const express = require("express");
const db = require("../database");

const router = express.Router();


// ================= ADMIN LOGIN =================

router.post("/login", (req, res) => {

    const { username, password } = req.body;

    console.log("Admin login attempt:", username);

    if (!username || !password) {

        return res.status(400).json({
            message: "Username and password are required"
        });

    }

    const sql = `
        SELECT id, username
        FROM admins
        WHERE username = ?
        AND password = ?
    `;

    db.get(
        sql,
        [username, password],
        (err, admin) => {

            if (err) {

                console.error(
                    "Admin login error:",
                    err.message
                );

                return res.status(500).json({
                    message: "Server error"
                });

            }

            if (!admin) {

                return res.status(401).json({
                    message: "Invalid admin credentials"
                });

            }

            res.status(200).json({
                message: "Admin login successful",
                admin: admin
            });

        }
    );

});

module.exports = router;
