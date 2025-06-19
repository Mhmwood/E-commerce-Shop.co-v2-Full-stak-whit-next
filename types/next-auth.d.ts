// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: "ADMIN" | "USER"; // Add custom fields
  }

  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "ADMIN" | "USER"; // Add to session
    };
  }
}
