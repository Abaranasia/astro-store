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

    const cartProducts= cart.map( item => {
        const dbProduct = dbProducts.find( p => p.Product.id === item.productId);
        if (!dbProduct) throw new Error(`Product with id ${item.productId} not found`);

        const { title, price, slug } = dbProduct.Product;
        const image = dbProduct.ProductImage.image;

        return {
            productId: item.productId,
            title,
            size: item.size,
            quantity: item.quantity,
            image: image.startsWith('http')
            ? image
            : `${ import.meta.env.PUBLIC_URL }/images/products/${ image }`,
            price,
            slug,
        }
    });

    return cartProducts
  },
});
