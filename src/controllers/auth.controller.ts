import { type Request, type Response } from "express";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { signToken, type AuthRequest } from "../middlewares/auth.middleware";
import { User } from "../models/user.model";
import {
  RegisterBody,
  LoginBody,
  LoginResponse,
  GetMeResponse,
  LogoutResponse,
} from "../lib/validation";

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, password, role } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const id = randomUUID();

  const user = new User({ id, name, email, password: hashed, role });
  await user.save();

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  res.status(201).json(
    LoginResponse.parse({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }),
  );
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  res.json(
    LoginResponse.parse({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }),
  );
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.json(LogoutResponse.parse({ message: "Logged out successfully" }));
}

export async function registerAdmin(req: Request, res: Response): Promise<void> {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const id = randomUUID();

  const user = new User({ id, name, email, password: hashed, role: "admin" });
  await user.save();

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  res.status(201).json(
    LoginResponse.parse({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }),
  );
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await User.findOne({ id: req.user.id });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(
    GetMeResponse.parse({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }),
  );
}
