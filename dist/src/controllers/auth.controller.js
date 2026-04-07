"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.registerAdmin = registerAdmin;
exports.getMe = getMe;
const crypto_1 = require("crypto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_model_1 = require("../models/user.model");
const validation_1 = require("../lib/validation");
async function register(req, res) {
    const parsed = validation_1.RegisterBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { name, email, password, role } = parsed.data;
    const existing = await user_model_1.User.findOne({ email });
    if (existing) {
        res.status(409).json({ error: "Email already registered" });
        return;
    }
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const id = (0, crypto_1.randomUUID)();
    const user = new user_model_1.User({ id, name, email, password: hashed, role });
    await user.save();
    const token = (0, auth_middleware_1.signToken)({ id: user.id, email: user.email, role: user.role });
    res.status(201).json(validation_1.LoginResponse.parse({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }));
}
async function login(req, res) {
    const parsed = validation_1.LoginBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { email, password } = parsed.data;
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    const token = (0, auth_middleware_1.signToken)({ id: user.id, email: user.email, role: user.role });
    res.json(validation_1.LoginResponse.parse({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }));
}
async function logout(_req, res) {
    res.json(validation_1.LogoutResponse.parse({ message: "Logged out successfully" }));
}
async function registerAdmin(req, res) {
    const parsed = validation_1.RegisterBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { name, email, password } = parsed.data;
    const existing = await user_model_1.User.findOne({ email });
    if (existing) {
        res.status(409).json({ error: "Email already registered" });
        return;
    }
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const id = (0, crypto_1.randomUUID)();
    const user = new user_model_1.User({ id, name, email, password: hashed, role: "admin" });
    await user.save();
    const token = (0, auth_middleware_1.signToken)({ id: user.id, email: user.email, role: user.role });
    res.status(201).json(validation_1.LoginResponse.parse({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }));
}
async function getMe(req, res) {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const user = await user_model_1.User.findOne({ id: req.user.id });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json(validation_1.GetMeResponse.parse({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }));
}
//# sourceMappingURL=auth.controller.js.map