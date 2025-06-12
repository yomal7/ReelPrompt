import express from "express";
import { check } from "express-validator";
import { signup, signin } from "../controllers/authcontroller.js";

const router = express.Router();

router.post(
  "/signup",
  [
    check("email").isEmail().normalizeEmail(),
    check("username").notEmpty(),
    check("password").isLength({ min: 8 }),
  ],
  signup
);

router.post(
  "/signin",
  [check("email").isEmail().normalizeEmail(), check("password").exists()],
  signin
);

export default router;
