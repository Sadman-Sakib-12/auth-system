import { Router } from "express";

import { register } from "../controllers/auth.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

import { requireRole } from "../middleware/role.middleware.js";

import { requireMinimumRole } from "../middleware/minimum-role.middleware.js";

const router = Router();

router.post("/register", register);

router.get(
  "/admin-test",
  requireAuth,
  requireRole("SUPER_ADMIN", "ADMIN"),
  (_req, res) => {
    res.status(200).json({
      message: "Admin access granted",
    });
  },
);

router.get(
  "/manager-test",
  requireAuth,
  requireMinimumRole("MANAGER"),
  (_req, res) => {
    res.status(200).json({
      message: "Manager-level access granted",
    });
  },
);

export default router;