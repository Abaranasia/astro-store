import { User, db, eq } from 'astro:db';
import { defineConfig } from 'auth-astro';

import Credentials from '@auth/core/providers/credentials';

import bcrypt from 'bcryptjs';
import type { AdapterUser } from '@auth/core/adapters';

export default defineConfig({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      authorize: async ({ email, password }) => {
        const [user] = await db.select().from(User).where(eq(User.email, `${email}`));

        if (!user) {
          throw new Error ('User not found')
        }

        if (!bcrypt.compareSync(password as string, user.password )) {
          throw new Error ('Invalid password')
        }

        const {password: _, ...rest} = user; // To remove the password from the return response
        return rest
      }
    })
    /*     GitHub({
          clientId: import.meta.env.GITHUB_CLIENT_ID,
          clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
        }), 
    */
  ],

  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = user;
      };
      return token;
    },
    session: ({ session, token  }) => {
      session.user = token.user as AdapterUser;
      // console.log('session :>> ', session);
      return session;
    }
  }
});