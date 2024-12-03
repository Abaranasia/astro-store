import { defineMiddleware } from 'astro:middleware';
import { getSession } from 'auth-astro/server';

const notAuthenticatedRoutes = ['/login', '/register'];

export const onRequest = defineMiddleware(
  async ({ url, locals, redirect, request }, next) => {
    const session = await getSession(request);
    const isLoggedIn = !!session;
    const user = session?.user;

    // TODO:
    locals.isLoggedIn = isLoggedIn;
    locals.user = null;
    locals.isAdmin = false;

    if (user) {
      // TODO:
      locals.user = {
        name: user.name!,
        email: user.email!,
        // avatar: UserActivation.photoURL ?? '',
        //emailVerified: user.emailVerified,
      };
    }

    locals.isAdmin = user?.role === 'admin';

    if (!locals.isAdmin && url.pathname.startsWith('/dashboard')) { // no admin is allowed on dashboard
      return redirect('/');
    }

    if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
      return redirect('/');
    }

    return next();
  }
);
