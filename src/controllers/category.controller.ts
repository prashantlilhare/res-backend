import { type Request, type Response } from "express";
import { randomUUID } from "crypto";
import { Category } from "../models/category.model";
import {
  CategoryBody as CreateCategoryBody,
  CategoryBody as UpdateCategoryBody,
  GetCategoryResponse,
  UpdateCategoryResponse,
  ListCategoriesResponse,
} from "../lib/validation";

function parseStringParam(req: Request, key: string): string | null {
  const raw = Array.isArray(req.params[key])
    ? req.params[key]![0]
    : req.params[key];
  return raw ?? null;
}

export async function listCategories(
  _req: Request,
  res: Response,
): Promise<void> {
  const categories = await Category.find().sort({ name: 1 });
  res.json(ListCategoriesResponse.parse(categories));
}

export async function getCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const id = parseStringParam(req, "id");
  if (!id) { res.status(400).json({ error: "ID required" }); return; }

  const category = await Category.findOne({ id });
  if (!category) { res.status(404).json({ error: "Category not found" }); return; }

  res.json(GetCategoryResponse.parse(category));
}

export async function createCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const category = new Category({ id: randomUUID(), ...parsed.data });
  await category.save();

  res.status(201).json(GetCategoryResponse.parse(category));
}

export async function updateCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const id = parseStringParam(req, "id");
  if (!id) { res.status(400).json({ error: "ID required" }); return; }

  const parsed = UpdateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const category = await Category.findOneAndUpdate(
    { id },
    parsed.data,
    { new: true }
  );

  if (!category) { res.status(404).json({ error: "Category not found" }); return; }

  res.json(UpdateCategoryResponse.parse(category));
}

export async function deleteCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const id = parseStringParam(req, "id");
  if (!id) { res.status(400).json({ error: "ID required" }); return; }

  const category = await Category.findOneAndDelete({ id });
  if (!category) { res.status(404).json({ error: "Category not found" }); return; }

  res.sendStatus(204);
}
