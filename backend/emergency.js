const express = require("express");
const db = require("../database");

const router = express.Router();

console.log("Route Loaded");


// ======================================================
// CREATE EMERGENCY REQUEST
// ======================================================

router.post("/", (req, res) => {

    console.log("POST /api/emergency received");

    const {
        user_id,
        disaster_type,
        location,
        latitude,
        longitude,
        people_count,
        description
    } = req.body;

    console.log("REQUEST BODY:", req.body);
    console.log("USER ID RECEIVED BY SERVER:", user_id);
    console.log("DESCRIPTION RECEIVED:", description);

    // Basic validation
    if (
        !user_id ||
        !disaster_type ||
        !location ||
        !people_count ||
        !description
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO emergency_requests
        (
            user_id,
            disaster_type,
            location,
            latitude,
            longitude,
            people_count,
            description
        )
        VALUES (?,?,?,?,?,?,?)
    `;

    db.run(
        sql,
        [
            user_id,
            disaster_type,
            location,
            latitude,
            longitude,
            people_count,
            description
        ],
        function (err) {

            if (err) {

                console.error(
                    "Error creating emergency request:",
                    err.message
                );

                return res.status(500).json({
                    message: "Failed to create emergency request"
                });

            }

            console.log("Emergency request created.");
            console.log("Request ID:", this.lastID);
            console.log("User ID:", user_id);
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            res.status(201).json({
                message: "Emergency request created successfully",
                requestId: this.lastID
            });

        }
    );

});


// ======================================================
// GET EMERGENCY REQUESTS FOR A USER
// ======================================================

router.get("/user/:userId", (req, res) => {

    const userId = req.params.userId;

    console.log("Fetching requests for user:", userId);

    const sql = `
        SELECT *
        FROM emergency_requests
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.all(sql, [userId], (err, rows) => {

        if (err) {

            console.error(
                "Error fetching emergency requests:",
                err.message
            );

            return res.status(500).json({
                message: "Failed to fetch emergency requests"
            });

        }

        res.status(200).json(rows);

    });

});


// ======================================================
// GET ALL EMERGENCY REQUESTS
// ======================================================

router.get("/", (req, res) => {

    console.log("Fetching all emergency requests");

    const sql = `
        SELECT *
        FROM emergency_requests
        ORDER BY created_at DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {

            console.error(
                "Error fetching all emergency requests:",
                err.message
            );

            return res.status(500).json({
                message: "Failed to fetch emergency requests"
            });

        }

        res.status(200).json(rows);

    });

});


// ======================================================
// ASSIGN OPERATION TEAM
// ======================================================

router.patch("/:id/assign", (req, res) => {

    const emergencyId = req.params.id;
    const { assigned_team } = req.body;

    console.log(
        `Assigning team to emergency #${emergencyId}`
    );

    console.log(
        "TEAM:",
        assigned_team
    );

    // Validate team
    if (!assigned_team) {

        return res.status(400).json({
            message: "Please select an operation team"
        });

    }

    const sql = `
        UPDATE emergency_requests
        SET assigned_team = ?,
            status = 'ASSIGNED'
        WHERE id = ?
    `;

    db.run(
        sql,
        [assigned_team, emergencyId],
        function (err) {

            if (err) {

                console.error(
                    "Error assigning team:",
                    err.message
                );

                return res.status(500).json({
                    message: "Failed to assign operation team"
                });

            }

            // Emergency request not found
            if (this.changes === 0) {

                return res.status(404).json({
                    message: "Emergency request not found"
                });

            }

            console.log(
                `Team assigned successfully to emergency #${emergencyId}`
            );

            res.status(200).json({
                message: "Operation team assigned successfully"
            });

        }
    );

});


// ======================================================
// UPDATE EMERGENCY STATUS
// ======================================================

router.patch("/:id/status", (req, res) => {

    const emergencyId = req.params.id;
    const { status } = req.body;

    console.log(
        `Updating status for emergency #${emergencyId}`
    );

    console.log(
        "NEW STATUS:",
        status
    );

    // Allowed statuses
    const allowedStatuses = [
        "PENDING",
        "ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED"
    ];

    if (!status || !allowedStatuses.includes(status)) {

        return res.status(400).json({
            message: "Invalid emergency status"
        });

    }

    const sql = `
        UPDATE emergency_requests
        SET status = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [status, emergencyId],
        function (err) {

            if (err) {

                console.error(
                    "Error updating status:",
                    err.message
                );

                return res.status(500).json({
                    message: "Failed to update emergency status"
                });

            }

            // Emergency request not found
            if (this.changes === 0) {

                return res.status(404).json({
                    message: "Emergency request not found"
                });

            }

            console.log(
                `Emergency #${emergencyId} status updated to ${status}`
            );

            res.status(200).json({
                message: "Emergency status updated successfully"
            });

        }
    );

});


module.exports = router;

