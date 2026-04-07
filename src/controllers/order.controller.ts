import { type Request, type Response } from "express";
import { randomUUID } from "crypto";
import { Order } from "../models/order.model";
import { MenuItem } from "../models/menu-item.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  OrderBody as CreateOrderBody,
  UpdateOrderStatusBody,
} from "../lib/validation";

function parseStringParam(req: Request, key: string): string | null {
  const raw = Array.isArray(req.params[key])
    ? req.params[key]![0]
    : req.params[key];
  return raw ?? null;
}

export async function listOrders(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const query = req.user!.role === "admin" ? {} : { userId: req.user!.id };
  const orders = await Order.find(query).sort({ createdAt: 1 });

  res.json(orders);
}

export async function getOrder(req: AuthRequest, res: Response): Promise<void> {
  const id = parseStringParam(req, "id");
  if (!id) { res.status(400).json({ error: "ID required" }); return; }

  const order = await Order.findOne({ id });
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }

  if (req.user!.role !== "admin" && order.userId !== req.user!.id) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  res.json(order);
}

export async function createOrder(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const requestedItems = parsed.data.items as Array<{
    menuItemId: string;
    quantity: number;
  }>;

  const ids = requestedItems.map((i) => i.menuItemId);

  const menuItems = await MenuItem.find({ id: { $in: ids } });
  const menuMap = new Map(menuItems.map((m) => [m.id, m]));

  const orderItems: any[] = [];
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

  const order = new Order({
    id: randomUUID(),
    userId: req.user!.id,
    items: orderItems,
    total: total,
    status: "pending",
  });

  await order.save();

  res.status(201).json(order);
}

export async function updateOrderStatus(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const id = parseStringParam(req, "id");
  if (!id) { res.status(400).json({ error: "ID required" }); return; }

  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const order = await Order.findOneAndUpdate(
    { id },
    { status: parsed.data.status },
    { new: true }
  );

  if (!order) { res.status(404).json({ error: "Order not found" }); return; }

  res.json(order);
}
