import { Router } from "express";
import { listOrders, getOrder, createOrder, updateOrderStatus } from "../controllers/order.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateToken);

router.get("/", listOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);

export default router;