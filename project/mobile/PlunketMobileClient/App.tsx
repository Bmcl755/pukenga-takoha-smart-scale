import tw from "./app/util/tw";
import { useDeviceContext } from "twrnc";
import { PaperProvider } from "react-native-paper";
import { PlunketApiProvider } from "./app/context/PlunketApiContext";

export default function App({ children }: { children: React.ReactNode }) {
  useDeviceContext(tw);
  return (
    <PlunketApiProvider>
      <PaperProvider>{children}</PaperProvider>
    </PlunketApiProvider>
  );
}
