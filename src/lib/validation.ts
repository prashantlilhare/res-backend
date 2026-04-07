import { z } from "zod";

export const RegisterBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["customer", "admin"]).optional().default("customer"),
});

export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const LoginResponse = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    role: z.string(),
  }),
});

export const GetMeResponse = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    role: z.string(),
  }),
});

export const LogoutResponse = z.object({
  message: z.string(),
});

export const CategoryBody = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});


export const CategoryResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

// export const ListCategoriesResponse = z.array(CategoryResponse);

export const MenuItemBody = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string().optional(),
  isVeg: z.boolean().optional(),
  emoji: z.string().optional(),
  bg: z.string().optional(),
});

export const MenuItemResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  categoryId: z.string().optional(),
  isVeg: z.boolean().optional(),
  emoji: z.string().optional(),
  bg: z.string().optional(),
});

export const OrderBody = z.object({
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
});

export const UpdateOrderStatusBody = z.object({
  status: z.string(),
});

export const HealthCheckResponse = z.object({
  status: z.string(),
  timestamp: z.string(),
});


export const ListCategoriesResponse = z.array(CategoryResponse);
export const GetCategoryResponse = CategoryResponse;
export const UpdateCategoryResponse = CategoryResponse;


export const ListMenuItemsResponse = z.array(MenuItemResponse);
export const GetMenuItemResponse = MenuItemResponse;
export const UpdateMenuItemResponse = MenuItemResponse;