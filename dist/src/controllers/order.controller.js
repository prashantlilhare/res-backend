"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrders = listOrders;
exports.getOrder = getOrder;
exports.createOrder = createOrder;
exports.updateOrderStatus = updateOrderStatus;
const crypto_1 = require("crypto");
const order_model_1 = require("../models/order.model");
const menu_item_model_1 = require("../models/menu-item.model");
const validation_1 = require("../lib/validation");
function parseStringParam(req, key) {
    const raw = Array.isArray(req.params[key])
        ? req.params[key][0]
        : req.params[key];
    return raw ?? null;
}
async function listOrders(req, res) {
    const query = req.user.role === "admin" ? {} : { userId: req.user.id };
    const orders = await order_model_1.Order.find(query).sort({ createdAt: 1 });
    res.json(validation_1.OrderBody.parse(orders));
}
async function getOrder(req, res) {
    const id = parseStringParam(req, "id");
    if (!id) {
        res.status(400).json({ error: "ID required" });
        return;
    }
    const order = await order_model_1.Order.findOne({ id });
    if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
    }
    if (req.user.role !== "admin" && order.userId !== req.user.id) {
        res.status(403).json({ error: "Access denied" });
        return;
    }
    res.json(validation_1.OrderBody.parse(order));
}
async function createOrder(req, res) {
    const parsed = validation_1.OrderBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const requestedItems = parsed.data.items;
    const ids = requestedItems.map((i) => i.menuItemId);
    const menuItems = await menu_item_model_1.MenuItem.find({ id: { $in: ids } });
    const menuMap = new Map(menuItems.map((m) => [m.id, m]));
    const orderItems = [];
    let total = 0;
    for (const item of requestedItems) {
        const found = menuMap.get(item.menuItemId);
        if (!found) {
            res.status(400).json({ error: `Menu item ${item.menuItemId} not found` });
            return;
        }
        const unitPrice = found.price;
        total += unitPrice * item.quantity;
        orderItems.push({
            menuItemId: found.id,
            name: found.name,
            price: found.price,
            quantity: item.quantity,
        });
    }
    const order = new order_model_1.Order({
        id: (0, crypto_1.randomUUID)(),
        userId: req.user.id,
        items: orderItems,
        total: total,
        status: "pending",
    });
    await order.save();
    res.status(201).json(validation_1.OrderBody.parse(order));
}
async function updateOrderStatus(req, res) {
    const id = parseStringParam(req, "id");
    if (!id) {
        res.status(400).json({ error: "ID required" });
        return;
    }
    const parsed = validation_1.UpdateOrderStatusBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const order = await order_model_1.Order.findOneAndUpdate({ id }, { status: parsed.data.status }, { new: true });
    if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
    }
    res.json(validation_1.OrderBody.parse(order));
}
//# sourceMappingURL=order.controller.js.map