import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import { loadAuthUser } from "./middleware/auth.middleware.js";

const app = express();

const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.use(loadAuthUser);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth System API is running",
  });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("API server running on http://localhost:" + PORT);
});