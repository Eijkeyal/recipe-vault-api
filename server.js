require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const receipeRoutes = require("./routes/receipeRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
connectDB();
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Recipe Vault API is running",
  });
});

app.use("/api/recipes", receipeRoutes);
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not Found" });
});
app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is running
on http://localhost:${PORT}`),
);
