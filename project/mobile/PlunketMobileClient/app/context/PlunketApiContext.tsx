// src/context/ApiContext.js
import { createContext, useState, useContext, useEffect } from "react";
import { AuthenticationState, PlunketApi } from "../lib/plunketApi";

// Create a context
export const PlunketApiContext = createContext<{
  api: PlunketApi;
  authState: AuthenticationState;
}>(null);

// Create a provider component
export const PlunketApiProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authState, setAuthState] = useState(AuthenticationState.Pending);
  const [api, setApi] = useState<PlunketApi>(null);

  useEffect(() => {
    const apiInstance = new PlunketApi();
    apiInstance.setAuthenticationStateChangeCallback(setAuthState);
    setApi(apiInstance);

    // Clean up function to avoid memory leaks
    return () => {
      apiInstance.setAuthenticationStateChangeCallback(() => {});
    };
  }, []);
  return (
    <PlunketApiContext.Provider value={{ api, authState }}>
      {children}
    </PlunketApiContext.Provider>
  );
};
