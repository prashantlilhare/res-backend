import { type Request, type Response } from "express";
import { randomUUID } from "crypto";
import { MenuItem } from "../models/menu-item.model";
import { Category } from "../models/category.model";
import {
 MenuItemBody as CreateMenuItemBody,
MenuItemBody as UpdateMenuItemBody,
GetMenuItemResponse,
UpdateMenuItemResponse,
ListMenuItemsResponse,
} from "../lib/validation";

function parseStringParam(req: Request, key: string): string | null {
  const raw = Array.isArray(req.params[key])
    ? req.params[key]![0]
    : req.params[key];
  return raw ?? null;
}

export async function listMenuItems(
  req: Request,
  res: Response,
): Promise<void> {
  const catRaw = req.query["categoryId"];
  const categoryId = catRaw ? String(catRaw) : null;

  const query = categoryId ? { categoryId } : {};
  const menuItems = await MenuItem.find(query).sort({ name: 1 });

  // Populate categories manually since categoryId is a string ref to Category.id
  const categoryIds = [...new Set(menuItems.map(item => item.categoryId).filter(Boolean))] as string[];
  const categories = await Category.find({ id: { $in: categoryIds } });
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

export async function getMenuItem(
  req: Request,
  res: Response,
): Promise<void> {
  const id = parseStringParam(req, "id");
  if (!id) { res.status(400).json({ error: "ID required" }); return; }

  const menuItem = await MenuItem.findOne({ id });
  if (!menuItem) { res.status(404).json({ error: "Menu item not found" }); return; }

  res.json(GetMenuItemResponse.parse(menuItem));
}

export async function createMenuItem(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = CreateMenuItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const menuItem = new MenuItem({ id: randomUUID(), ...parsed.data });
  await menuItem.save();

  res.status(201).json(GetMenuItemResponse.parse(menuItem));
}

export async function updateMenuItem(
  req: Request,
  res: Response,
): Promise<void> {
  const id = parseStringParam(req, "id");
  if (!id) { res.status(400).json({ error: "ID required" }); return; }

  const parsed = UpdateMenuItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const menuItem = await MenuItem.findOneAndUpdate(
    { id },
    parsed.data,
    { new: true }
  );

  if (!menuItem) { res.status(404).json({ error: "Menu item not found" }); return; }

  res.json(UpdateMenuItemResponse.parse(menuItem));
}

export async function deleteMenuItem(
  req: Request,
  res: Response,
): Promise<void> {
  const id = parseStringParam(req, "id");
  if (!id) { res.status(400).json({ error: "ID required" }); return; }

  const menuItem = await MenuItem.findOneAndDelete({ id });
  if (!menuItem) { res.status(404).json({ error: "Menu item not found" }); return; }

  res.sendStatus(204);
}
