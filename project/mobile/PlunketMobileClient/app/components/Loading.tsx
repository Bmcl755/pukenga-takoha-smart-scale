import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import tw from "../util/tw";

export default function Loading() {
  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <ActivityIndicator animating={true} size="large" />
      <Text style={tw`mt-2`}>Loading...</Text>
    </View>
  );
}
