import { DefaultSession, DefaultUser} from '@auth/core/types';

// we create this definition file to expand auth.js with our custom fields

declare module '@auth/core/types' {
    interface User extends DefaultUser {
        role?: string;

    };

    interface Session extends DefaultSession {
        user: User;
    }
}