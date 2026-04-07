"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.register);
router.post("/admin/register", auth_controller_1.registerAdmin);
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_middleware_1.authenticateToken, auth_controller_1.logout);
router.get("/me", auth_middleware_1.authenticateToken, auth_controller_1.getMe);
router.get("/", (req, res) => {
    res.send("Auth route working ✅");
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map