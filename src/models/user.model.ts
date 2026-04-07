import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, default: "customer" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>("User", userSchema);