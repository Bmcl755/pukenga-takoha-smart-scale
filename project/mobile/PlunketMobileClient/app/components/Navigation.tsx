import tw from "../util/tw";
import { Button, Pressable, View } from "react-native";
import { Link } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import usePlunketApi from "../hooks/usePlunketApi";
export default function Navigation() {
  const { api } = usePlunketApi();
  return (
    <>
      <View style={tw`h-14 flex flex-row items-center justify-around bg-main`}>
        <Link replace href="/main">
          <View style={tw`flex-row items-center justify-center`}>
            <Entypo name="home" size={24} color="white" />
            {/* <Text style={tw`text-white font-medium ml-2`}></Text> */}
          </View>
        </Link>
        <Link replace href="/support">
          <View style={tw`flex-row items-center justify-center`}>
            <Entypo name="help-with-circle" size={24} color="white" />
            {/* <Text style={tw`text-white font-medium ml-2`}></Text> */}
          </View>
        </Link>
        <Pressable
          onPress={async () => {
            alert(`Logged in as user ID: ${await api.getUserId()}`);
          }}
        >
          <View style={tw`flex-row items-center justify-center`}>
            <FontAwesome6 name="user-large" size={22} color="white" />
            {/* <Text style={tw`text-white font-medium ml-2`}></Text> */}
          </View>
        </Pressable>
      </View>
    </>
  );
}
