"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateToken);
router.get("/", order_controller_1.listOrders);
router.get("/:id", order_controller_1.getOrder);
router.post("/", order_controller_1.createOrder);
router.put("/:id/status", order_controller_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=order.routes.js.map