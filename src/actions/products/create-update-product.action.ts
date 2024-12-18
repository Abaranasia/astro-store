import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";

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

    console.log('user :>> ', user);
    console.log('form :>> ', form);
    
    if (!user) throw new Error ('Unauthorized operation')

    return;
  },
});
