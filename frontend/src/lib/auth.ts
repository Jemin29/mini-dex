import type { NextAuthOptions, RequestInternal } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { SiweMessage } from "siwe";

type WalletUser = {
  id: string;
  address: string;
  name?: string;
};

function getCookieValue(cookieHeader: string | undefined | null, name: string): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split("=")[1] || "");
}

function getExpectedDomain(req: Pick<RequestInternal, "headers">): string {
  const headerHost = req.headers?.host || "localhost:3000";
  const baseUrl = process.env.NEXTAUTH_URL || `http://${headerHost}`;
  return new URL(baseUrl).host;
}

const walletProvider = CredentialsProvider({
  id: "wallet",
  name: "Wallet",
  credentials: {
    message: { label: "Message", type: "text" },
    signature: { label: "Signature", type: "text" }
  },
  async authorize(credentials, req) {
    try {
      if (!credentials?.message || !credentials?.signature) return null;

      const siwe = new SiweMessage(JSON.parse(credentials.message));
      const expectedDomain = getExpectedDomain(req);
      const nonce = getCookieValue(req.headers?.cookie, "siwe-nonce");

      if (!nonce) return null;

      const result = await siwe.verify({
        signature: credentials.signature,
        domain: expectedDomain,
        nonce
      });

      if (!result.success) return null;

      const address = siwe.address.toLowerCase();
      const user: WalletUser = {
        id: address,
        address,
        name: `${address.slice(0, 6)}...${address.slice(-4)}`
      };

      return user;
    } catch {
      return null;
    }
  }
});

const providers: NextAuthOptions["providers"] = [walletProvider];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  );
}

if (process.env.AUTH_EMAIL_SERVER && process.env.AUTH_EMAIL_FROM) {
  providers.push(
    EmailProvider({
      server: process.env.AUTH_EMAIL_SERVER,
      from: process.env.AUTH_EMAIL_FROM
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && "address" in user) {
        token.address = user.address as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.address = token.address as string | undefined;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
