import { Weighing } from "../lib/plunketApi";
import tw from "../util/tw";
import { View, Text } from "react-native";

export default function WeightCard(props: { weighing: Weighing }) {
  return (
    <View
      style={tw`my-2 py-4 px-5 border border-main rounded-xl flex flex-row items-center justify-between`}
    >
      <Text style={tw`text-2xl text-main`}>
        {props.weighing.weight.toFixed(2)} kg
      </Text>
      <Text style={tw`text-xl text-main`}>
        {new Date(props.weighing.date).toLocaleDateString()}
      </Text>
    </View>
  );
}
