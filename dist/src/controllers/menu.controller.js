"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMenuItems = listMenuItems;
exports.getMenuItem = getMenuItem;
exports.createMenuItem = createMenuItem;
exports.updateMenuItem = updateMenuItem;
exports.deleteMenuItem = deleteMenuItem;
const crypto_1 = require("crypto");
const menu_item_model_1 = require("../models/menu-item.model");
const category_model_1 = require("../models/category.model");
const validation_1 = require("../lib/validation");
function parseStringParam(req, key) {
    const raw = Array.isArray(req.params[key])
        ? req.params[key][0]
        : req.params[key];
    return raw ?? null;
}
async function listMenuItems(req, res) {
    const catRaw = req.query["categoryId"];
    const categoryId = catRaw ? String(catRaw) : null;
    const query = categoryId ? { categoryId } : {};
    const menuItems = await menu_item_model_1.MenuItem.find(query).sort({ name: 1 });
    // Populate categories manually since categoryId is a string ref to Category.id
    const categoryIds = [...new Set(menuItems.map(item => item.categoryId).filter(Boolean))];
    const categories = await category_model_1.Category.find({ id: { $in: categoryIds } });
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
    // Transform the response to include category object
    const transformedItems = menuItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        category: item.categoryId ? { id: item.categoryId, name: categoryMap.get(item.categoryId)?.name } : null,
        isVeg: item.isVeg,
        emoji: item.emoji,
        bg: item.bg,
    }));
    res.json(transformedItems);
}
async function getMenuItem(req, res) {
    const id = parseStringParam(req, "id");
    if (!id) {
        res.status(400).json({ error: "ID required" });
        return;
    }
    const menuItem = await menu_item_model_1.MenuItem.findOne({ id });
    if (!menuItem) {
        res.status(404).json({ error: "Menu item not found" });
        return;
    }
    res.json(validation_1.GetMenuItemResponse.parse(menuItem));
}
async function createMenuItem(req, res) {
    const parsed = validation_1.MenuItemBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const menuItem = new menu_item_model_1.MenuItem({ id: (0, crypto_1.randomUUID)(), ...parsed.data });
    await menuItem.save();
    res.status(201).json(validation_1.GetMenuItemResponse.parse(menuItem));
}
async function updateMenuItem(req, res) {
    const id = parseStringParam(req, "id");
    if (!id) {
        res.status(400).json({ error: "ID required" });
        return;
    }
    const parsed = validation_1.MenuItemBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const menuItem = await menu_item_model_1.MenuItem.findOneAndUpdate({ id }, parsed.data, { new: true });
    if (!menuItem) {
        res.status(404).json({ error: "Menu item not found" });
        return;
    }
    res.json(validation_1.UpdateMenuItemResponse.parse(menuItem));
}
async function deleteMenuItem(req, res) {
    const id = parseStringParam(req, "id");
    if (!id) {
        res.status(400).json({ error: "ID required" });
        return;
    }
    const menuItem = await menu_item_model_1.MenuItem.findOneAndDelete({ id });
    if (!menuItem) {
        res.status(404).json({ error: "Menu item not found" });
        return;
    }
    res.sendStatus(204);
}
//# sourceMappingURL=menu.controller.js.map