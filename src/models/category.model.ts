import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);