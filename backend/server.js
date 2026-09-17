const express = require("express");
const cors = require("cors");
const db = require("./database");
const authRoutes = require("./routes/auth");
const emergencyRoutes = require("./routes/emergency");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
    res.send("My new server is running");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
