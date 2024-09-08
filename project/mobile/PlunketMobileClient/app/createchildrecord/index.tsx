import tw from "../util/tw";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { router } from "expo-router";
import { useState } from "react";
import usePlunketApi from "../hooks/usePlunketApi";
import Loading from "../components/Loading";

export default function CreateChildRecord() {
  const inputStyle = tw`w-full py-3 px-3 mb-4 border border-main rounded-xl`;

  const { api } = usePlunketApi();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleCreate() {
    setLoading(true);
    // create the child record
    const response = await api.createNewChild(firstName, lastName, address);

    if (response.success) {
      setLoading(false);
      router.push("/main");
    } else {
      setLoading(false);
      alert(response.message);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={tw`bg-white p-4 h-screen`}>
      <Text style={tw`text-main text-2xl mb-6`}>New Child Record</Text>
      <TextInput
        mode="outlined"
        style={tw`w-full mb-2`}
        label="First Name"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        mode="outlined"
        style={tw`w-full mb-2`}
        label="Last Name"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        mode="outlined"
        style={tw`w-full mb-2`}
        label="Address"
        value={address}
        onChangeText={(text) => setAddress(text)}
      />
      <Button
        style={tw`w-full py-1 rounded-lg mt-2`}
        loading={false}
        disabled={false}
        mode="contained"
        onPress={() => handleCreate()}
      >
        Create
      </Button>
    </View>
  );
}
