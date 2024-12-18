import { defineAction } from "astro:actions";
import { db, eq, Product } from "astro:db";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";
import { v4 as UUID } from "uuid";

const MAX_FILE_SIZE = 5_000_000 // 5MB
const ACCEPTED_IMAGE_TYPES = [
'image/jpeg',
'image/jpg',
'image/png',
'image/webp',
'image/svg+xml',
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
      .refine( file => file.size <= MAX_FILE_SIZE, 'max image file is 5Mb')
      .refine( file => {
        if (file.size === 0) return true;
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      }, `Only supported image types are: ${ACCEPTED_IMAGE_TYPES.join(',')}`)
    ).optional(),

    // TODO imagen
  }),
  handler: async (form, context) => {
    const session = await getSession(context.request);
    // NTH: middleware to check user permissions
    const user = session?.user;

    if (!user) throw new Error("Unauthorized operation");

    const { id = UUID(), imageFiles, ...rest } = form;
    rest.slug = rest.slug.toLowerCase().replaceAll(" ", "-").trim();

    const product = {
      id,
      user: user.id!,
      ...rest,
    };
    if (!form.id) {
      // Create new product
      await db.insert(Product).values(product);
    } else {
      // Update existing product
      await db.update(Product).set(product).where(eq(Product.id, id));
    }

    // Image insert

    console.log("user :>> ", user);
    console.log("product :>> ", product);

    return product;
  },
});
