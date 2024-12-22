import { db, eq, Product, ProductImage } from "astro:db";

import { defineAction } from "astro:actions";
import { z } from "astro:schema";

const newProduct = {
  id: "",
  description: "new description",
  gender: "men",
  price: 0,
  sizes: "XS, S, M",
  slug: "",
  stock: 5,
  tags: "shirt, men, new",
  title: "",
  type: "shirts",
};

export const getproductBySlug = defineAction({
  accept: "json",
  input: z.string(),
  handler: async (slug) => {
    // For new products
    if (slug === "new") {
      return {
        product: newProduct,
        images: [],
      };
    }

    const [product] = await db
      .select()
      .from(Product)
      .where(eq(Product.slug, slug));

    if (!product) {
      throw new Error(`Product with slug ${slug} not found`);
    }

    const images = await db
      .select()
      .from(ProductImage)
      .where(eq(ProductImage.productId, product.id));

    return {
      product: product,
      // images: images.map((i) => i.image),
      images: images,
    };
  },
});
