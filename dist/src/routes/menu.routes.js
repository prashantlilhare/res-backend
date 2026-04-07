"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menu_controller_1 = require("../controllers/menu.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", menu_controller_1.listMenuItems);
router.get("/:id", menu_controller_1.getMenuItem);
router.post("/", auth_middleware_1.authenticateToken, menu_controller_1.createMenuItem);
router.put("/:id", auth_middleware_1.authenticateToken, menu_controller_1.updateMenuItem);
router.delete("/:id", auth_middleware_1.authenticateToken, menu_controller_1.deleteMenuItem);
exports.default = router;
//# sourceMappingURL=menu.routes.js.map