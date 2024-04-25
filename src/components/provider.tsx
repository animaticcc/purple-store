"use client";
import { SessionProvider } from "next-auth/react";

export function Provider({children}: any) {
  return (
    <SessionProvider>{children}</SessionProvider>
  );
}