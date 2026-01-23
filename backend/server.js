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
const SubscriptionRoutes = require("./routes/subscriptionRoutes");
const menuRoutes= require("./routes/providerMenuRoutes");
const customerMenuRoutes = require("./routes/customerMenuRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes")
const providerprofileRoutes = require("./routes/providerprofileRoutes")

app.use("/api/tiffins", tiffinRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/subscriptions", SubscriptionRoutes);
app.use("/api/provider-menus", menuRoutes);
app.use("/api/customer-menus", customerMenuRoutes);
app.use("/api/deliveriestatus", deliveryRoutes)
app.use("/api/providerprofiles", providerprofileRoutes)