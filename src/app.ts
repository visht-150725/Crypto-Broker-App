import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import orderRoutes from "./routes/order.routes";
import profileRoutes from "./routes/profile.routes";
//import portfolioRoutes from "./routes/portfolio.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Broker API Running" });
});

// Routes
app.use("/user", userRoutes);
app.use("/orders", orderRoutes);
app.use("/profile", profileRoutes);
//app.use("/portfolio", portfolioRoutes);

export default app;
