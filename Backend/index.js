import connectToMongo from "../Backend/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import morgan from "morgan";
dotenv.config();
connectToMongo();

const app = express();
const port = 8000; // process.env.PORT || 8000;

// Middleware for logging requests
app.use(morgan("dev"));

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND,
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "PATCH"],
    credentials: true,
  })
);

// Available Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", notesRoutes);

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  const buildPath = path.join(__dirname, "../Frontend/build");
  app.use(express.static(buildPath));
  app.get("(/*)?", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`📝 Todosense Backend listening at port ${port}`);
});

export default app;
