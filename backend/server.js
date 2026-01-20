const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB(); // 👈 DB CONNECT HERE

const app = express();



app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running & DB connected");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const tiffinRoutes = require("./routes/tiffinRoutes");

app.use("/api/tiffins", tiffinRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

