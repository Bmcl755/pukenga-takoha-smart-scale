import tw from "../util/tw";
import { Text, Pressable } from "react-native";

export default function Button(props) {
    return (
        <Pressable
            style={tw`w-full py-3 items-center bg-main rounded-xl`}
            onPress={props.onPress}
        >
            <Text style={tw`text-base text-white`}>{props.text}</Text>
        </Pressable>
    );
}
