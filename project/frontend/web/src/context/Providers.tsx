"use client";

import { ApiContextProvider } from "./ApiContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApiContextProvider>{children}</ApiContextProvider>;
}
