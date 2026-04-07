import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  isVeg?: boolean;
  emoji?: string;
  bg?: string;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  categoryId: { type: String, ref: "Category" },
  isVeg: { type: Boolean, default: false },
  emoji: { type: String },
  bg: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const MenuItem = mongoose.model<IMenuItem>("MenuItem", menuItemSchema);