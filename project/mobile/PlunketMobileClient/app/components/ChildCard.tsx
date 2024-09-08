import tw from "../util/tw";
import { View, Text, Pressable } from "react-native";
import { router, Link } from "expo-router";
import { Child } from "../lib/plunketApi";

export default function ChildCard(props: { child: Child }) {
  function handleNavigation() {
    router.push(`/childrecord/${props.child._id}`);
  }

  // Get the most recent weight
  // Sort the weighings by date
  let mostRecentWeight = "No data";

  if (props.child.weighings.length > 0) {
    const weighings = props.child.weighings;
    weighings.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    mostRecentWeight = `${weighings[0].weight.toFixed(2)} kg`;
  }

  return (
    <Pressable onPress={handleNavigation}>
      <View
        style={tw`my-2 py-4 px-5 border border-main rounded-xl flex flex-row items-center justify-between`}
      >
        <View>
          <Text style={tw`text-2xl text-main`}>
            {`${props.child.first_name} ${props.child.last_name.toUpperCase()}`}
          </Text>
          <Text style={tw`text-main`}>{props.child.address}</Text>
        </View>
        <Text style={tw`text-xl text-main`}>{mostRecentWeight}</Text>
      </View>
    </Pressable>
  );
}
