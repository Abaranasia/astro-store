import { ImageTools } from "@/utils/imageTools";
import { defineAction } from "astro:actions";
import { db, eq, ProductImage } from "astro:db";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";

export const deleteProductImage = defineAction({
  accept: "json",
  input: z.string(),
  handler: async (imageId, context) => {
    const session = await getSession(context.request);
    const user = session?.user;

    if (!user || user.role !== "admin")
      throw new Error("Unauthorized operation");

    const [productImage] = await db
      .select()
      .from(ProductImage)
      .where(eq(ProductImage.id, imageId));

    if (!productImage) {
      throw new Error(`image with id ${imageId} not found`);
    }

    // Deletes the image from the db
    const deleted = await db
      .delete(ProductImage)
      .where(eq(ProductImage.id, imageId));
      
    // this condition ensures that images having http come from cloudinary
    if (productImage.image.includes("http")) {
      await ImageTools.delete(productImage.image);
    }

    return {ok: true};
  },
});
