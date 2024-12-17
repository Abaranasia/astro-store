import type { CartItem } from "@/interfaces/cart-item";
import { defineAction } from "astro:actions";
import { db, eq, inArray, Product, ProductImage } from "astro:db";

export const loadProductsFromCart = defineAction({
  accept: "json",
  // input: z.string(), // No need props because actions have direct access to cookies
  handler: async (_, { cookies }) => {
    // We're getting cookies from context

    const cart = JSON.parse(cookies.get("cart")?.value ?? "[]") as CartItem[];
    
    if (cart.length === 0) return [];

    // load products
    const productIds = cart.map((item: CartItem) => item.productId);

    const dbProducts = await db
      .select()
      .from(Product)
      .innerJoin( ProductImage, eq(Product.id, ProductImage.productId))
      .where(inArray(Product.id, productIds));

      console.log('dbProducts :>> ', dbProducts);
    return cart;
  },
});
