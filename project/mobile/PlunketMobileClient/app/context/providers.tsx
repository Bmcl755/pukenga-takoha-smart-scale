import { PlunketApiProvider } from "./PlunketApiContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <PlunketApiProvider>{children}</PlunketApiProvider>;
}
