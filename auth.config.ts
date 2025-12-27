import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export default {
  providers: [
    Google({
      profile(profile) {
        const encodedName = profile.name.replace(' ', '-');
        return {
          id: profile.sub,
          name: encodedName,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
