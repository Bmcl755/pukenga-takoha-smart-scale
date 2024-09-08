import { View, Image } from "react-native";
import { Button } from "react-native-paper";
import tw from "../util/tw";
import { router } from "expo-router";
import usePlunketApi from "../hooks/usePlunketApi";

export default function Header() {
  const { api } = usePlunketApi();

  async function handleLogout() {
    await api.logout();
    router.replace("/");
  }

  const logoScale = 0.027;
  return (
    <View style={tw`flex-row items-center justify-center mt-9 mx-2`}>
      <Image
        source={require("../../assets/plunket-logo-no-text.png")}
        style={tw`w-[${476 * logoScale}] h-[${288 * logoScale}] ml-4`}
      />
      <Button style={tw`ml-auto`} onPress={() => handleLogout()}>
        Logout
      </Button>
    </View>
  );
}
