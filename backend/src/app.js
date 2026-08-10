const express = require("express");
const cors = require("cors");
const ticketRoutes = require("./routes/ticket.route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res) => {
    res.json({
        message: "Support is running",
    });
});

app.use("/api/tickets",ticketRoutes);

module.exports = app;