"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
exports.getCategory = getCategory;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const crypto_1 = require("crypto");
const category_model_1 = require("../models/category.model");
const validation_1 = require("../lib/validation");
function parseStringParam(req, key) {
    const raw = Array.isArray(req.params[key])
        ? req.params[key][0]
        : req.params[key];
    return raw ?? null;
}
async function listCategories(_req, res) {
    const categories = await category_model_1.Category.find().sort({ name: 1 });
    res.json(validation_1.ListCategoriesResponse.parse(categories));
}
async function getCategory(req, res) {
    const id = parseStringParam(req, "id");
    if (!id) {
        res.status(400).json({ error: "ID required" });
        return;
    }
    const category = await category_model_1.Category.findOne({ id });
    if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
    }
    res.json(validation_1.GetCategoryResponse.parse(category));
}
async function createCategory(req, res) {
    const parsed = validation_1.CategoryBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const category = new category_model_1.Category({ id: (0, crypto_1.randomUUID)(), ...parsed.data });
    await category.save();
    res.status(201).json(validation_1.GetCategoryResponse.parse(category));
}
async function updateCategory(req, res) {
    const id = parseStringParam(req, "id");
    if (!id) {
        res.status(400).json({ error: "ID required" });
        return;
    }
    const parsed = validation_1.CategoryBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const category = await category_model_1.Category.findOneAndUpdate({ id }, parsed.data, { new: true });
    if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
    }
    res.json(validation_1.UpdateCategoryResponse.parse(category));
}
async function deleteCategory(req, res) {
    const id = parseStringParam(req, "id");
    if (!id) {
        res.status(400).json({ error: "ID required" });
        return;
    }
    const category = await category_model_1.Category.findOneAndDelete({ id });
    if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
    }
    res.sendStatus(204);
}
//# sourceMappingURL=category.controller.js.map