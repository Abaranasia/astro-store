import { defineAction } from "astro:actions";
import { db, eq, Product } from "astro:db";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";
import { v4 as UUID } from 'uuid';

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

    // TODO imagen
  }),
  handler: async (form, context) => {
    const session = await getSession(context.request);
    // NTH: middleware to check user permissions
    const user = session?.user;

    if (!user) throw new Error ('Unauthorized operation')

    const { id = UUID(), ...rest} = form;
    rest.slug = rest.slug.toLowerCase().replaceAll(' ', '-').trim();

    const product = {
        id,
        user: user.id!,
        ...rest,
    }
    // Create

    // Update
    await db.update(Product).set(product).where(eq(Product.id, id));
    
    // Image insert


    console.log('user :>> ', user);
    console.log('product :>> ', product);
    

    return product;
  },
});
