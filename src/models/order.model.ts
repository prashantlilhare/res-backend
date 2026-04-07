import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface IOrder extends Document {
  id: string;
  userId: string;
  total: number;
  status: string;
  items: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  menuItemId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
});

const orderSchema = new Schema<IOrder>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, ref: "User" },
  total: { type: Number, required: true },
  status: { type: String, required: true, default: "pending" },
  items: [orderItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);