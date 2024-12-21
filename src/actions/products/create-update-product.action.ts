import { ImageTools } from "@/utils/imageTools";
import { defineAction } from "astro:actions";
import { db, eq, Product, ProductImage } from "astro:db";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";
import { v4 as UUID } from "uuid";

const MAX_FILE_SIZE = 5_000_000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export const createUpdateProduct = defineAction({
  accept: "form",
  input: z.object({
    id: z.string().optional(),
    description: z.string(),
    gender: z.string(),
    price: z.number(),
    sizes: z.string(),
    slug: z.string(),
    stock: z.number(),
    tags: z.string(),
    title: z.string(),
    type: z.string(),

    imageFiles: z.array(
          z.instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, "max image file is 5Mb")
          .refine((file) => {
            if (file.size === 0) return true;
            return ACCEPTED_IMAGE_TYPES.includes(file.type);
          }, `Only supported image types are: ${ACCEPTED_IMAGE_TYPES.join(",")}`)
      ).optional(),

    // TODO imagen
  }),
  handler: async (form, context) => {
    const session = await getSession(context.request);
    // NTH: middleware to check user permissions
    const user = session?.user;

    if (!user || user.role !== "admin")
      throw new Error("Unauthorized operation");

    const { id = UUID(), imageFiles, ...rest } = form;
    rest.slug = rest.slug.toLowerCase().replaceAll(" ", "-").trim();

    const product = {
      id,
      user: user.id!,
      ...rest,
    };

    const queries: any = [];

    if (!form.id) {
      // Create new product
      queries.push(db.insert(Product).values(product));
    } else {
      // Update existing product
      queries.push(db.update(Product).set(product).where(eq(Product.id, id)));
    }

    // Image insert
    const secureUrls: string[] = [];
    if (
      form.imageFiles &&
      form.imageFiles.length > 0 &&
      form.imageFiles[0].size > 0
    ) {
      const urls = await Promise.all(
        form.imageFiles.map((file) => ImageTools.upload(file))
      );

      secureUrls.push(...urls.filter((url): url is string => url !== null));
    }

    secureUrls.forEach((imageUrl) => {
      const imageObj = {
        id: UUID(),
        image: imageUrl,
        productId: product.id,
      };

      queries.push(db.insert(ProductImage).values(imageObj));
    });

    await db.batch(queries);

    return product;
  },
});
