/**
 * This is the main module of running the code.
 * Configured according to the .env file which will be submitted as well
 */

const express = require("express");
const cors = require("cors");
const ticketRoutes = require("./routes/ticket.route");
const authRoutes = require("./routes/auth.route");
const { protect } = require("./middleware/auth");

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim()) 
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Datastraw CRM API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tickets", protect, ticketRoutes);

module.exports = app;
