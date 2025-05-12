import express from "express";
import "dotenv/config";
import authRoute from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/api/auth",authRoute)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on Port : ${PORT}...`);
  connectDB();
});
