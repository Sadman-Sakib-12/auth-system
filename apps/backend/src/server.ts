import express from "express";

const app = express();

const PORT = 5000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth System API is running",
  });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});