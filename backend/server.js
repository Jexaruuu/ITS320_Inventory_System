const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const session = require('express-session');
const cors = require('cors');

const app = express();
connectDB();

// ✅ CORRECT ORDER STARTS HERE
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    secure: false
  }
}));

app.use(express.json()); // ✅ This must come AFTER session
// ✅ CORRECT ORDER ENDS HERE

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));