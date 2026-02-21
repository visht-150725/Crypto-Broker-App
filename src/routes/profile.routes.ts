import { Router } from "express";
import { getProfile } from "../controllers/profile.controller";

const router = Router();

router.get("/:userId", getProfile);

export default router;
