import tw from "../../util/tw";
import { View, Text, ScrollView } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import WeightCard from "../../components/WeightCard";
import { FAB } from "react-native-paper";
import { Child } from "../../lib/plunketApi";
import { useCallback, useEffect, useState } from "react";
import usePlunketApi from "../../hooks/usePlunketApi";
import Ionicons from "@expo/vector-icons/Ionicons";
import Loading from "../../components/Loading";

export default function ChildRecord() {
  const { childid } = useLocalSearchParams<{
    childid: string;
  }>();

  const { api } = usePlunketApi();

  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const updateChildRecord = async () => {
    const response = await api.getChild(childid);

    if (response.success) {
      setChild(response.children[0]);
      setLoading(false);
    } else {
      alert(response.message);
      router.push("/");
    }
  };

  useEffect(() => {
    updateChildRecord();
  }, [childid]);

  useFocusEffect(
    useCallback(() => {
      updateChildRecord();
    }, [childid])
  );

  function toNewMeasurement() {
    router.push(`/childrecord/${child._id}/newrecord`);
  }

  if (loading) {
    return <Loading />;
  }

  function getWeighings() {
    // sort the weighings by date
    const weighings = child.weighings;
    weighings.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return weighings.map((weighing) => {
      return <WeightCard key={weighing._id} weighing={weighing} />;
    });
  }

  function mostRecentWeight(): string {
    if (child.weighings.length > 0) {
      // sort the weighings by date
      const weighings = child.weighings;
      weighings.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      return `${weighings[0].weight.toFixed(2)} kg`;
    } else {
      return "No data";
    }
  }

  return (
    <View style={tw`bg-white h-screen w-screen p-4`}>
      <Text style={tw`text-3xl mt-4 text-main`}>{`${
        child.first_name
      } ${child.last_name.toUpperCase()}`}</Text>
      <Text style={tw`text-sm mb-10 text-main`}>ID {child._id}</Text>
      <Text style={tw`text-lg my-1 text-main`}>{child.address}</Text>
      <Text style={tw`text-lg my-1 text-main`}>
        Most Recent Weight: {mostRecentWeight()}
      </Text>
      <Text style={tw`text-lg my-1 text-main`}>Historic Weighings:</Text>
      <View style={tw`flex-col justify-center items-center h-[55%]`}>
        {child.weighings.length > 0 ? (
          <ScrollView style={tw`w-full h-full`}>{getWeighings()}</ScrollView>
        ) : (
          <View style={tw`flex-col justify-center items-center my-20`}>
            {/* Display a warning icon */}
            <Ionicons name="warning" size={32} color="black" />
            <Text>No data</Text>
          </View>
        )}

        <FAB
          icon="plus"
          label="New Measurement"
          style={tw`absolute right-0 bottom-0`}
          onPress={() => toNewMeasurement()}
        />
      </View>
    </View>
  );
}
