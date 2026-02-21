import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserById
} from "../controllers/user.controller";

const router = Router();

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get user by ID
router.get("/:id", getUserById);

export default router;
