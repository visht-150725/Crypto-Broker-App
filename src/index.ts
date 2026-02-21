import app from "./app";
import { prisma } from "./config/prisma";

const PORT = 5000;

async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
