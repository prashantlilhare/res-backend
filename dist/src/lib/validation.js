"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMenuItemResponse = exports.GetMenuItemResponse = exports.ListMenuItemsResponse = exports.UpdateCategoryResponse = exports.GetCategoryResponse = exports.ListCategoriesResponse = exports.HealthCheckResponse = exports.UpdateOrderStatusBody = exports.OrderBody = exports.MenuItemResponse = exports.MenuItemBody = exports.CategoryResponse = exports.CategoryBody = exports.LogoutResponse = exports.GetMeResponse = exports.LoginResponse = exports.LoginBody = exports.RegisterBody = void 0;
const zod_1 = require("zod");
exports.RegisterBody = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(1),
    role: zod_1.z.enum(["customer", "admin"]).optional().default("customer"),
});
exports.LoginBody = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.LoginResponse = zod_1.z.object({
    token: zod_1.z.string(),
    user: zod_1.z.object({
        id: zod_1.z.string(),
        email: zod_1.z.string(),
        name: zod_1.z.string(),
        role: zod_1.z.string(),
    }),
});
exports.GetMeResponse = zod_1.z.object({
    user: zod_1.z.object({
        id: zod_1.z.string(),
        email: zod_1.z.string(),
        name: zod_1.z.string(),
        role: zod_1.z.string(),
    }),
});
exports.LogoutResponse = zod_1.z.object({
    message: zod_1.z.string(),
});
exports.CategoryBody = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
});
exports.CategoryResponse = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
});
// export const ListCategoriesResponse = z.array(CategoryResponse);
exports.MenuItemBody = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive(),
    categoryId: zod_1.z.string().optional(),
    isVeg: zod_1.z.boolean().optional(),
    emoji: zod_1.z.string().optional(),
    bg: zod_1.z.string().optional(),
});
exports.MenuItemResponse = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number(),
    categoryId: zod_1.z.string().optional(),
    isVeg: zod_1.z.boolean().optional(),
    emoji: zod_1.z.string().optional(),
    bg: zod_1.z.string().optional(),
});
exports.OrderBody = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        menuItemId: zod_1.z.string(),
        quantity: zod_1.z.number().int().positive(),
    })),
});
exports.UpdateOrderStatusBody = zod_1.z.object({
    status: zod_1.z.string(),
});
exports.HealthCheckResponse = zod_1.z.object({
    status: zod_1.z.string(),
    timestamp: zod_1.z.string(),
});
exports.ListCategoriesResponse = zod_1.z.array(exports.CategoryResponse);
exports.GetCategoryResponse = exports.CategoryResponse;
exports.UpdateCategoryResponse = exports.CategoryResponse;
exports.ListMenuItemsResponse = zod_1.z.array(exports.MenuItemResponse);
exports.GetMenuItemResponse = exports.MenuItemResponse;
exports.UpdateMenuItemResponse = exports.MenuItemResponse;
//# sourceMappingURL=validation.js.map