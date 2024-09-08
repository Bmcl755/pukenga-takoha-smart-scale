import tw from "./util/tw";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import usePlunketApi from "./hooks/usePlunketApi";
import { AuthenticationState } from "./lib/plunketApi";
import Loading from "./components/Loading";

export default function Login() {
  const [email, setEmail] = useState("Kailyn21");
  const [password, setPassword] = useState("rPzLnMRYZGJ18NE");

  const { api, authState } = usePlunketApi();

  async function handleLogin() {
    const response = await api.login(email, password);
    // Clear the fields
    setEmail("");
    setPassword("");

    if (response.success) {
      // Logged in successfully
      router.replace("/main");
    } else {
      // Failed to login
      alert(response.message);
    }
  }

  if (authState === AuthenticationState.Pending) {
    return <Loading />;
  }

  return (
    <>
      <View style={tw`bg-white h-screen w-screen px-4 pt-30 items-center`}>
        <Image
          style={tw`h-48 w-64"`}
          source={require("../assets/image.png")}
        ></Image>
        <Text style={tw`text-lg mt-12 mb-3 text-main mr-auto`}>Welcome</Text>
        <TextInput
          mode="outlined"
          style={tw`w-full`}
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={tw`w-full mt-2`}
          mode="outlined"
          label="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <Button
          style={tw`w-full py-1 rounded-lg mt-6`}
          mode="contained"
          onPress={() => {
            handleLogin();
          }}
        >
          Login
        </Button>
        <Text style={tw`mt-4 text-slate-500`}>
          The use of this application is bound by our terms and conditions. We
          take data security and privacy seriously, you can read about our
          processes in our privacy policy.
        </Text>
      </View>
    </>
  );
}
