import { Api } from "../services/Api";
import { createContext, useContext } from "react";

const apiUri = process.env["API"];

export const api = new Api(apiUri);

export const ApiContext = createContext(api);

export const useApiContext = () => useContext(ApiContext);

export function ApiContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}
