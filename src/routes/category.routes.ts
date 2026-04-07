import { Router } from "express";
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", listCategories);
router.get("/:id", getCategory);
router.post("/", authenticateToken, createCategory);
router.put("/:id", authenticateToken, updateCategory);
router.delete("/:id", authenticateToken, deleteCategory);

export default router;