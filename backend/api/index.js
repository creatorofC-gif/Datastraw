const app = require('../src/app');
const connectDB = require('../src/config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Vercel DB Connection Error:", error);
    return res.status(500).json({
      message: "Database Connection Failure on Vercel Serverless Function",
      error: error.message
    });
  }
  return app(req, res);
};
