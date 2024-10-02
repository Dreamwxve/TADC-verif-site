import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: "identify email" } },
      async profile(profile, tokens) {
        /*
        if (tokens.access_token && process.env.server && process.env.bot_token) {
          try {
            await fetch(`https://discord.com/api/guilds/${process.env.server}/members/${profile.id}`, {
              method: "PUT",
              access_token: tokens.access_token,
              body: JSON.stringify({
                access_token: tokens.access_token,
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bot ${process.env.bot_token}`,
              },
            });
          } catch {} // ignore errors
        }
        */
        return profile;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      if (token.profile) {
        session.user.profile = token.profile;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.profile = profile;
      }
      return token;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
