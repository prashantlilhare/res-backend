import { Router } from "express";
import { register, registerAdmin, login, logout, getMe } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/admin/register", registerAdmin);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);
router.get("/me", authenticateToken, getMe);
router.get("/", (req, res) => {
  res.send("Auth route working ✅");
});

export default router;