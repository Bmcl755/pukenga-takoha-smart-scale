import { View, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import tw from "../util/tw";
import { useState } from "react";
import { router } from "expo-router";

export default function Support() {
    const [input, setInput] = useState("");

    function handleSubmit(input: String) {
        router.navigate("/main");
    }

    return (
        <View style={tw`h-screen bg-white p-4`}>
            <Text style={tw`text-2xl text-main my-10`}>
                Submit a support request
            </Text>
            {/* <Text style={tw`text-main`}>Please describe your issue</Text> */}
            <TextInput
                style={tw`w-full my-6 text-sm`}
                mode="outlined"
                label="Please describe your issue"
                value={input}
                onChangeText={(text) => setInput(text)}
            />
            <Button
                style={tw`w-full py-1 rounded-lg mt-2`}
                loading={false}
                disabled={false}
                mode="contained"
                onPress={() => handleSubmit(input)}
            >
                Submit
            </Button>
        </View>
    );
}
