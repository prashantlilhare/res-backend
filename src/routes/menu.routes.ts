import { Router } from "express";
import { listMenuItems, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem } from "../controllers/menu.controller";
import { authenticateToken } from "../middlewares/auth.middleware";


const router = Router();

router.get("/", listMenuItems);
router.get("/:id", getMenuItem);
router.post("/", authenticateToken, createMenuItem);
router.put("/:id", authenticateToken, updateMenuItem);
router.delete("/:id", authenticateToken, deleteMenuItem);

export default router;